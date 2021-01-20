import React from 'react'

const Pagination = ({postsPerPage,totalPosts,paginate,currentPage}) => {

    const pageNumbers = []
    for(let i=1;i<=Math.ceil(totalPosts/postsPerPage);i++){
        pageNumbers.push(i)
    }

    return (
            <ul className='pagination'>
                {currentPage===1 ? 
                <li className='disabled'><a href='# '><i className="material-icons">chevron_left</i></a></li> :
                <li className='waves-effect' onClick={() => paginate(currentPage-1)}>
                    <a href='# '><i className="material-icons">chevron_left</i></a>
                </li>
                }
                {
                    pageNumbers.map((number) => 
                    <li className={number===currentPage ? "active" : "waves-effect"} key={number} onClick={() => paginate(number)}>
                        <a href='# '>{number}</a>
                    </li>
                )}
                {currentPage===pageNumbers.length ? 
                <li className='disabled'><a href='# '><i class="material-icons">chevron_right</i></a></li> :
                <li className='waves-effect' onClick={() => paginate(currentPage+1)}>
                    <a href='# '><i className="material-icons">chevron_right</i></a>
                </li>
                }
            </ul>
    )
}

export default Pagination