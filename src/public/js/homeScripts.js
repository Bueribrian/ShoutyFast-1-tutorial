const mostPopular = function(){
    fetch('/')
    .then(response => {
        console.log(response)
    })
    .catch(err=>{
        console.log({err:err})
    })
}
mostPopular()