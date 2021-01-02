import React from 'react'

const Pagination = ({postsPerPage,totalPosts,paginate,currentPage}) => {

    const pageNumbers = []
    for(let i=1;i<=Math.ceil(totalPosts/postsPerPage);i++){
        pageNumbers.push(i)
    }

    return (
            <ul className='pagination'>
                <li class={currentPage==1 ? "disabled" : "waves-effect"} onClick={currentPage==1 ? null : () => paginate(currentPage-1)}>
                    <a><i class="material-icons">chevron_left</i></a>
                </li>
                {
                    pageNumbers.map((number) => 
                    <li className={number==currentPage ? "active" : "waves-effect"} key={number} onClick={() => paginate(number)}>
                        <a>{number}</a>
                    </li>
                )}
                <li class={currentPage==pageNumbers.length ? "disabled" : "waves-effect"} onClick={currentPage==pageNumbers.length ? null : () => paginate(currentPage+1)}>
                    <a><i class="material-icons">chevron_right</i></a>
                </li>
            </ul>
    )
}

export default Pagination