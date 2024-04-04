// NOTE: this file is poorly named
import { addContestant, getContestants, rmContestant } from "./contestants"

const userDataUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_player_data'
const postsUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_posts'
const playerPostsUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_player_posts'
const currentWinnerUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/current_winner?select=*'
const winnerArchiveUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/win_archive_view?select=*&limit=50'
const ygsUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/ygs'
const contestantsUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/update_contestants'
const victorUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/update_recent_showdown'
const leaderboardUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_paginated_leaderboard'
const insertPostUrl = 'https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/insert_post'


const tierIds = [
    '1878f11f-782b-43fe-9aa3-cd34e989b174', 
    '629558be-c63d-4255-9bf5-1e98826fa3de',
    '402261d8-4db8-4e24-8886-90dc6da6fcd1'
]

const loadUser = async function() {
    return new Promise((resolve) => {
        fetch('https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_player_data', {
            method: 'POST', // why post?
            headers: {
                "APIKey": localStorage.getItem("apikey"),
                "Authorization": localStorage.getItem("token")
            }
        }).then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then((r) => {
            // note: when an empty bearer token is provided, the server responds with 200 OK with an empty array as
            // the body instead of the expected 401. This is a bug with Pithee that we need to account for!
            if (r.body.length > 0) {
                resolve(r.body[0])
            } else {
                alertLoginExpired()
            }
        })
    })
}


const checkLogin = async function() {
    return new Promise((resolve) => {
        fetch('https://oqutjaxxxzzbjtyrfoka.supabase.co/rest/v1/rpc/get_player_data', {
            method: 'POST', // why post?
            headers: {
                "APIKey": localStorage.getItem("apikey"),
                "Authorization": localStorage.getItem("token")
            }
        }).then(r =>  r.json().then(data => ({status: r.status, body: data})))
        .then((r) => {
            // note: when an empty bearer token is provided, the server responds with 200 OK with an empty array as
            // the body instead of the expected 401. This is a bug with Pithee that we need to account for!
            if (r.body.length > 0) {
                resolve({
                    success: true,
                    user: r.body[0]
                })
            } else if (r.status == 200) {
                resolve({
                    success: false,
                    apikeyInvalid: false,
                    tokenInvalid: true,
                })
            } else {
                resolve({
                    success: false,
                    apikeyInvalid: true,
                    tokenInvalid: true,
                })
            }
        }).catch((err) => {
            // alert(err)
            resolve({
                success: false,
            })
        })
    })
}

const loadUserPosts = async function () {
    return new Promise((resolve) => {
        fetch(playerPostsUrl, {
        method: 'POST',
        headers: {
            "apikey": localStorage.getItem('apikey'),
            "authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        body: null
    })
    .then(r => r.json().then(data => ({status: r.status, body: data})))
    .then((r) => {
        if (r.status >= 200 && r.status <= 299) { // OK range

            // usually we check if the r.body return array length is 0, but that 
            // fails on this call because the user may not have any posts, so
            // just resolve

            resolve(r.body)
        } else {
            alertLoginExpired()
        }
    })
})
}

const loadCurrentWinner = async function() {
    return makePitheeApiCall(currentWinnerUrl, 'GET', null)
}

const loadWinArchive = async function() {
    return makePitheeApiCall(winnerArchiveUrl, 'GET', null)
}

const fetchPosts = async function() {
    return makePitheeApiCall(postsUrl, 'POST', JSON.stringify({post_quantity: 20}))
}

const loadLeaderboardPage = async function(page) {
    return makePitheeApiCall(leaderboardUrl, 'POST', JSON.stringify({
        page_number: page,
        page_size: 25
    }))
}

const updateContestants = async function() {
    return makePitheeNoContentApiCall(contestantsUrl, 'POST', JSON.stringify({contestants: getContestants()}))
}

const showdownVictor = async function(victor_id) {
    return makePitheeNoContentApiCall(victorUrl, 'POST', JSON.stringify({showdown_victor: victor_id}))
}

const pushPostScore = async function(post) {
    if (post.tier < 1 || post.tier > 3) {
        console.log('invalid tier value')
        return
    }

    // just going to leave this unattended. sure I should check if the call
    // failed, but I won't. Maybe I'll fix it later
    makePitheeNoContentApiCall(ygsUrl, 'POST', JSON.stringify({
        jacks: post.id,
        films: tierIds[post.tier-1] 
    })) // good one, guys

    // also update contestants for a three star post
    // what confuses me is that the contestants for a showdown are stored
    // client-side, but we still need to push them to the server. why?
    // if you ask me, the contestants should be all on the server or on
    // the client. IMO all on the server is better because I don't think
    // showdown progress is retained upon refresh or login/logout which is silly
    if (post.tier === 3) {
        addContestant(post)
        updateContestants()
    }

}

const declareVictor = function (post) {
    // upon showdown victor, another ygs call is made with the tier3 uuid,
    // as well as a call to update_recent_showdown
    // then, ONLY the victor is removed from the contestants
    // this means that the very next post to reach tier3 triggers a showdown
    // is this intended behavior? idk, but I will mirror it.
    makePitheeNoContentApiCall(ygsUrl, 'POST', JSON.stringify({
        jacks: post.id,
        films: tierIds[2] 
    })) // good one, guys
    showdownVictor(post.id)
    rmContestant(post)
    updateContestants()
}

const insertPost = function (postText) {
    // the /insert_post endpoint weirdly responds with a string instead of
    // JSON on success so I can't use the regular makePitheeApiCall function
    return makePitheeNoContentApiCall(insertPostUrl, 'POST', JSON.stringify({
        post_text: postText
    }))
}

// /ygs and /update_contestants endpoints do not serve JSON responses so we need this func
// ALSO both of those endpoints return 204 OK when a null authorization is given... ???
const makePitheeNoContentApiCall = async function(url, method, body) {
    return new Promise((resolve) => {
            fetch(url, {
            method: method,
            headers: {
                "apikey": localStorage.getItem('apikey'),
                "authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: body
        })
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) { // OK range
                resolve(r.body)
            } else if (r.status === 401) {
                alertLoginExpired()
            } else {
                // TODO: this is little information for the client.
                // the server could be responding with a 401 due to expired
                // key (expected behavior) OR it could be a 500 server error and the client
                // will not know the difference. This should be fixed!
                resolve(null)
            }
        })
    })
}

// the API annoyingly returns a 200 OK with an empty array response body
// when called with a null api key...
const makePitheeApiCall = async function(url, method, body) {
    return new Promise((resolve) => {
            fetch(url, {
            method: method,
            headers: {
                "apikey": localStorage.getItem('apikey'),
                "authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            },
            body: body
        })
        .then(r => r.json().then(data => ({status: r.status, body: data})))
        .then((r) => {
            if (r.status >= 200 && r.status <= 299) { // OK range
                // check if empty array is given (token is null)
                if (r.body.length == 0) {
                    alertLoginExpired()
                }
                resolve(r.body)
            } else if (r.status === 401) {
                alertLoginExpired()
            } else {
                // TODO: this is little information for the client.
                // the server could be responding with a 401 due to expired
                // key (expected behavior) OR it could be a 500 server error and the client
                // will not know the difference. This should be fixed!
                resolve(null)
            }
        })
    })
}

// sends the "Your login has expired" alert IF the user has logged in before
// sends a silent redirect to /login if the user has never logged in
const alertLoginExpired = () => {
    if (localStorage.getItem('apikey') != null) {
        console.log(localStorage.getItem('apikey'))
        alert("Your token has expired. Please re-enter your information to keep using Prittee.")
    }
    window.location.href = '/login'
}

export { 
    loadUser, 
    loadWinArchive, 
    loadCurrentWinner, 
    fetchPosts, 
    pushPostScore, 
    declareVictor, 
    loadUserPosts, 
    loadLeaderboardPage,
    insertPost,
    checkLogin,
}