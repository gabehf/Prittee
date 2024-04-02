import { Grid } from '@mui/material';
import Post from './Post';
import { declareVictor, fetchPosts, pushPostScore } from '../utils'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Queue from '../queue'
import { getFullContestants, lenContestants, rmContestant } from '../contestants';

const postsSkeleton = [
    {
        post_text: '',
        index: 0,
        id: '1',
        tier: 0,
    },
    {
        post_text: '',
        index: 1,
        id: '2',
        tier: 0,
    },
    {
        post_text: '',
        index: 2,
        id: '3',
        tier: 0,
    },
    {
        post_text: '',
        index: 3,
        id: '4',
        tier: 0,
    },
]

const PostQueue = new Queue()

export default function PostGrid() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)
    const [posts, setPosts] = useState(postsSkeleton)
    const [loading, setLoading] = useState(false)

    // every time data state changes i.e. every time a user clicks on post,
    // update posts with their selection
    // note: this also will load the initial posts
    useEffect(()=> {
        //
        // rebuild post array with kept post
        // render new array
        updatePosts(selected)
    }, [selected])

    // handler passed to Post children to let us know when one has been selected
    const selectPost = (post) => {
        post.tier += 1
        if (post.tier == 4) { // triggers on a showdown winner
            declareVictor(post)
            setSelected(null)
            // return early because we already handled selecting a showdown winner
            return
        }
        // one of these if statements will trigger when a 
        // post has reached the end of its ranking,
        // or if it has reached max-tier respectively
        if (selected != null && post.id != selected.id && selected.tier != 3) {
            pushPostScore(selected)
        }
        if (post.tier == 3){
            pushPostScore(post)
        }
        // triggers when it's time for a showdown
        if (lenContestants() >= 4) {
            setPosts(getFullContestants())
            // return early so as to not trigger the updatePosts logic and 
            // instead render the showdown
            return
        }
        setSelected(post)
    }

    // handles updating the post state
    const refreshPosts = (keep) => {
        // this line prevents trying to refresh posts on mount, when
        // no posts have actually been loaded yet
        if (PostQueue.size() < 4) { return }
        const arr = []
        for (var i = 0; i < 4; i++) {
            if (keep != null && keep.index == i && keep.tier < 3) {
                arr.push(keep)
            } else {
                let p = PostQueue.pop()
                arr.push(
                    {
                        post_text: p.post_text,
                        index: i,
                        id: p.post_id,
                        tier: 0,
                    }
                )
            }
        }
        setPosts(arr)
    }

    // handles refilling the queue when needed, then calls refreshPosts
    const updatePosts = (keep) => {
        console.log(`loading: ${loading}`)
        // if the queue is really low, we want to stop the user from making any more
        // selections to let the queue reload
        if (PostQueue.size() <= 4) {
            if (loading) {
                console.log('user is clicking too fast!')
                // if we are already loading in new posts and the user 
                // is basically spam clicking, just return right away to
                // prevent it from requesting more posts
                return
            }
            setLoading(true)
            console.log('loading last-second posts...')
            fetchPosts().then((r) => {
                if (r == null) {
                } else {
                    r.forEach(npost => {
                        PostQueue.push(npost)
                    });
                    refreshPosts(keep)
                    setLoading(false)
                }
            })
        } else if (PostQueue.size() <= 11  && !loading) {
            // somewhat low queue -> fetch more posts in the background
            setLoading(true)
            console.log('loading more posts...')
            fetchPosts().then((r) => {
                if (r == null) {
                    alert("Your token has expired. Please re-enter your information to keep using Prittee.")
                    navigate('/login')
                } else {
                    r.forEach(npost => {
                        PostQueue.push(npost)
                    });
                    setLoading(false)
                }
            }) 
            refreshPosts(keep)
        } else {
            // full queue -> keep going as normal
            refreshPosts(keep)
        }
    }

    return (
        <Grid container spacing={1}>
            {posts.map((p) => {
                return(
                <Grid item xs={6} key={'post-grid-'+p.index}>
                    <Post text={p.post_text} key={p.id} id={p.id} tier={p.tier} index={p.index} onClick={selectPost}/>
                </Grid>
            )})}
        </Grid>
    )
} 

