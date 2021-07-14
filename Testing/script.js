let conditionObject = {
    root: null,
    threshold: "0.9"
}
let observer = new IntersectionObserver(callBack, conditionObject);
let elements = document.querySelectorAll(".video-container");
elements.forEach((el) => {
    observer.observe(el);
})



function callBack(entries) {
    // console.log(entries);
    entries.forEach((entry) => {
        let child = entry.target.children[0];
        // console.log(child.id)
        // play -> async work 
        // pause -> sync work
        // if (entry.isIntersecting) {
        //     console.log(child.id)
        // } else {
        //     console.log(child.id)

        // }
        
        child.play().then(function(){
            if (entry.isIntersecting == false) {
                child.pause();
            }  
        })
    })
}