let contestants = {}

const addContestant = function(post) {
    contestants[post.id] = post
}

const rmContestant = function(post) {
    delete contestants[post.id]
}

const lenContestants = function() {
    return Object.keys(contestants).length
}

const getContestants = function() {
    return Object.keys(contestants)
}

const getFullContestants = function() {
    // when fetching the full contestants, the indices need
    // to be reset to prevent duplication in the React renderer
    let raw = Object.values(contestants)
    let i = 0
    for (let post of raw) {
        post.index = i
        i++
    }
    return raw
}

export { addContestant, rmContestant, lenContestants, getContestants, getFullContestants }