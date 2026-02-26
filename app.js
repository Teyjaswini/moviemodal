const cl = console.log;

const movieForm = document.getElementById('movieForm')
const addMovieBtn = document.getElementById('addMovieBtn')
const updateMovieBtn = document.getElementById('updateMovieBtn')
const movieNameControl = document.getElementById('movieName')
const movieImgControl = document.getElementById('movieImg')
const movieDescriptionControl = document.getElementById('movieDescription')
const movieRatingControl = document.getElementById('movieRating')
const movieContainer = document.getElementById('movieContainer')


let moviesArr = []

if (localStorage.getItem('moviesArr')) {
  moviesArr = JSON.parse(localStorage.getItem('moviesArr'))
}

function snackBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000
  })
}


function setRating(rating) {
  if (rating >= 4) {
    return 'badge-success'
  } else if (rating >= 3 && rating < 4) {
    return 'badge-warning'
  } else {
    return 'badge-danger'
  }
}

function createMovieCards(arr) {
  let result = ''
  const movieContainer = document.getElementById('movieContainer')
  arr.forEach(movie => {
    result += `<div class="col-md-3 col-sm-6 mb-4">
                <div class="card movieCard h-100" id="${movie.movieID}">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${movie.movieName}</h4>
                            </div>
                            <div class="col-2">
                                <h4>
                                    <span class="badge ${setRating(movie.movieRating)}">
                                      ${movie.movieRating}
                                    </span>

                                </h4>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <figure>
                            <img
                            src="${movie.movieImg}"
                            alt="${movie.movieName}" 
                            title="${movie.movieName}">
                            <figcaption>
                                <h5>
                                  ${movie.movieName}
                                </h5>
                                <p>
                                  ${movie.movieDescription}
                                </p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
            </div>`
  })

  movieContainer.innerHTML = result;
}
createMovieCards(moviesArr)



const movieModalShowBtn = document.getElementById('movieModalShowBtn')
const backDrop = document.getElementById('backDrop')
const movieModal = document.getElementById('movieModal')

const closeModalBtns = [...document.querySelectorAll('.closeModal')]

function onMovieModaltoggle() {
  movieForm.reset()
  backDrop.classList.toggle('active')
  movieModal.classList.toggle('active')
}


movieModalShowBtn.addEventListener('click', onMovieModaltoggle)

closeModalBtns.forEach(ele => {
  ele.addEventListener('click', onMovieModaltoggle)
})





function onMovieAdd(eve) {
  eve.preventDefault();
  let movieObj = {
    movieName: movieNameControl.value,
    movieImg: movieImgControl.value,
    movieDescription: movieDescriptionControl.value,
    movieRating: movieRatingControl.value,
    movieID: Date.now().toString()
  }

  movieForm.reset()
  moviesArr.unshift(movieObj)

  localStorage.setItem('moviesArr', JSON.stringify(moviesArr))

  let col = document.createElement('div');
  col.className = 'col-md-3 col-sm-6 mb-4';


  col.innerHTML = `
                <div class="card movieCard h-100" id="${movieObj.movieID}">
                    <div class="card-header">
                        <div class="row">
                            <div class="col-10">
                                <h4>${movieObj.movieName}</h4>
                            </div>
                            <div class="col-2">
                                <h4>
                                    <span class="badge ${setRating(movieObj.movieRating)}">
                                    ${movieObj.movieRating}
                                    </span>

                                </h4>
                            </div>
                        </div>
                    </div>

                    <div class="card-body p-0">
                        <figure>
                            <img 
                              src = "${movieObj.movieImg}"
                              alt="${movieObj.movieName}" 
                              title="${movieObj.movieName}">
                            <figcaption>
                                <h5>${movieObj.movieName}</h5>
                                <p>
                                  ${movieObj.movieDescription}
                                </p>
                            </figcaption>
                        </figure>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
            `

  const movieContainer = document.getElementById('movieContainer')
  movieContainer.prepend(col)
  onMovieModaltoggle()

  snackBar(`The movie ${movieObj.movieName} is added successfully !!!`, 'success')

}

function onRemove(ele) {
  let REMOVE_ID = ele.closest('.movieCard').id

  Swal.fire({
    title: `Are you sure, you want to remove the movie with id ${REMOVE_ID}?`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#212529",
    cancelButtonColor: "#e50914",
    confirmButtonText: "Yes, remove it!"
  }).then((result) => {
    if (result.isConfirmed) {
      let getIndex = moviesArr.findIndex(m => m.movieID === REMOVE_ID)

      if (getIndex > -1) {
        let movies = moviesArr.splice(getIndex, 1)
        localStorage.setItem('moviesArr', JSON.stringify(moviesArr))
        ele.closest('.col-md-3').remove()
        snackBar(`The movie ${movies[0].movieName} is removed successfully !!!`, 'success')
      }
    }
  });

}


function onEdit(ele) {
  let EDIT_ID = ele.closest('.movieCard').id;
  localStorage.setItem('EDIT_ID', EDIT_ID)
  let EDIT_OBJ = moviesArr.find(m => {
    return m.movieID === EDIT_ID
  })
  onMovieModaltoggle()
  addMovieBtn.classList.add('d-none');
  updateMovieBtn.classList.remove('d-none');
  movieNameControl.value = EDIT_OBJ.movieName
  movieImgControl.value = EDIT_OBJ.movieImg
  movieDescriptionControl.value = EDIT_OBJ.movieDescription
  movieRatingControl.value = EDIT_OBJ.movieRating

}

function onMovieUpdate() {
  let UPDATE_ID = localStorage.getItem('EDIT_ID')
  localStorage.removeItem('EDIT_ID')
  let UPDATED_OBJ = {
    movieName: movieNameControl.value,
    movieImg: movieImgControl.value,
    movieDescription: movieDescriptionControl.value,
    movieRating: movieRatingControl.value,
    movieID: UPDATE_ID
  }

  // Get the position of Object(Index Number)

  let getIndex = moviesArr.findIndex(m => m.movieID === UPDATE_ID)

  // UPDATE IN ARRAY

  moviesArr[getIndex] = UPDATED_OBJ

  // UPDATE IN LOCAL STORAGE

  localStorage.setItem('moviesArr', JSON.stringify(moviesArr))
  onMovieModaltoggle()

  // UPDATE ON UI

  // UPDATE ON UI

  let movieCard = document.getElementById(UPDATE_ID)

  movieCard.innerHTML = `
    <div class="card-header">
        <div class="row">
            <div class="col-10">
                <h4>${UPDATED_OBJ.movieName}</h4>
            </div>
            <div class="col-2">
                <h4>
                    <span class="badge ${setRating(UPDATED_OBJ.movieRating)}">
                        ${UPDATED_OBJ.movieRating}
                    </span>
                </h4>
            </div>
        </div>
    </div>

    <div class="card-body p-0">
        <figure>
            <img 
              src="${UPDATED_OBJ.movieImg}"
              alt="${UPDATED_OBJ.movieName}" 
              title="${UPDATED_OBJ.movieName}">
            <figcaption>
                <h5>${UPDATED_OBJ.movieName}</h5>
                <p>
                    ${UPDATED_OBJ.movieDescription}
                </p>
            </figcaption>
        </figure>
    </div>

    <div class="card-footer d-flex justify-content-between">
        <button onclick="onEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
        <button onclick="onRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
    </div>
`

  snackBar(`The movie ${UPDATED_OBJ.movieName} is updated successfully !!!`, 'success')

  addMovieBtn.classList.remove('d-none');
  updateMovieBtn.classList.add('d-none');



}

movieForm.addEventListener('submit', onMovieAdd)
updateMovieBtn.addEventListener('click', onMovieUpdate)