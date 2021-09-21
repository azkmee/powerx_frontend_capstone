/**
 * Get comic information from API
 * @param {int}     comic_num   comic number to retrieve from API
 * @returns {JSON}              JSON of the comic
 */

const get_comic = (comic_num) => {
    return fetch(`https://intro-to-js-playground.vercel.app/api/xkcd-comics/${comic_num}`, 
    ).then(
        (response) => {
            let items = response.json();
            return items;
        }
    ).then(
        data => {
            return data;
        }
    ).catch(
        () => {
            return false;
        }
    )
}


/**
 * Update comic on webpage
 * @param {int} comicNum    comic number to retrieve from API
 * @param {int} index       index to display on webapage
 */
function updateComic(comicNum, index) {
    get_comic(comicNum).then(data => {
        document.getElementById(`comic${index}`).src = data.img;
        loader.style.display = 'none';
        document.getElementById(`comic${index}-title`).innerHTML = `#${data.num} - ${data.title}`;
    })
}

/**
 * retrieve the next 3 comic index to display.
 * @param {int}     n       comic series to retrieve
 * @returns {array}         array of comic series to retrieve
 */
function comic_series(n) {
    const ret = [n, n+1, n+2].map( (x) => ((x+ lastAvail) % lastAvail) == 0 ? lastAvail : (x+ lastAvail) % lastAvail)
    n = ret[0];
    return ret;
}

/**
 * update sets of comics
 * @param {int} n comic starting index to update
 */
function updateComicFrom(n) {
    const comicToUpdate = comic_series(n)
    loaderActivate();
    numInput.value = '';
    for (let k = 0; k < 3; k++) {
        updateComic(comicToUpdate[k], k+1);
    }

    inputError.classList.add('hidden');
}

/**
 * Display error message when user input wrong input
 * @param {string} msg error message to display
 */
function showError(msg) {
    inputError.classList.remove('hidden');
    inputError.innerHTML = msg;
}

/**
 * Activate loading animation
 */
function loaderActivate() {
    document.getElementById(`comic1`).src = '';
    document.getElementById(`comic2`).src = '';
    document.getElementById(`comic3`).src = '';

    document.getElementById(`comic1-title`).innerHTML = '';
    document.getElementById(`comic2-title`).innerHTML = '';
    document.getElementById(`comic3-title`).innerHTML = '';

    loader.style.display = 'flex';

}

/**
 * Loop to update the last available comic
 * @param {*} {int} comic 
 */
const get2 = (num)=> {
    // const controller = new AbortController
        fetch(`https://intro-to-js-playground.vercel.app/api/xkcd-comics/${num}`
        ).then((res) => res.json()).then((data) => {
            // console.log(data)
            lastAvail = num
            get2(num+1)
        })
        .catch( (err)=> {
            // controller.abort()
            numInput.setAttribute("placeholder",`max pg. ${lastAvail}`);
            main();
        })
}

let lastAvail = 2493;

const prev = document.getElementById('prev');
const random = document.getElementById('random');
const next = document.getElementById('next');
const numInput = document.getElementById('page-input');
const goTo = document.getElementById("go-to");
const inputError = document.getElementById("error-show");
const loader = document.getElementById("loader-row");
inputError.classList.add('hidden');

function main() {

    let n = 1;

    loaderActivate();
    updateComic(1,1);
    updateComic(2,2);
    updateComic(3,3);
    
    
    loader.style.display = 'none';
    numInput.setAttribute("placeholder",`max pg. ${lastAvail}`);
    
    prev.addEventListener('click', () => {
        n -= 3;
        updateComicFrom(n);
    })
    
    next.addEventListener('click', () => {
        n += 3;
        updateComicFrom(n);
    })
    
    random.addEventListener('click', () => {
        n = Math.floor(Math.random() * lastAvail);
        updateComicFrom(n);
    })
    
    goTo.addEventListener('click', () => {
        const n_ = +numInput.value;
        if ( !Number.isInteger(n_)){
            showError("Page value needs to be an integer");
            return;
        }
        else if (n_ > lastAvail){
            showError("That comic hasn't been released yet");
            return;
        } else if (n_<0){
            showError("Please enter a positive comic number");
            numInput.value = '';
            return;
        } else {
            n = n_
        }
    
        loaderActivate();
        
        
        updateComicFrom(n);
    })
    
    numInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter'){
            goTo.click();
        }
    })
}

get2(lastAvail);
