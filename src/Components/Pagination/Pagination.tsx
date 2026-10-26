import Styles from './Pagination.module.css'
import { useAppDispatch, useAppSelector } from '../../Utils/Redux/Hooks'
import { useEffect } from 'react';
import { setCurrentPage, setPageTotal } from '../../Utils/Redux/paginationSlice';

export default function Pagination() {
    const { currentPage, totalPage, elementsPerPage } = useAppSelector((state) => state.pagination);
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.products.productToShow)

    useEffect(() => {
        setPagination();
    }, [products])

    const setPagination = () => {
        const totalP = Math.ceil(products.length / elementsPerPage)
        if (totalP) {
            dispatch(setPageTotal(totalP));
        }
    }
    const handleNext = () => {
        const nextPage = currentPage + 1
        dispatch(setCurrentPage(nextPage))
    }
    const handlePrevious = () => {
        const previousPage = currentPage - 1
        dispatch(setCurrentPage(previousPage));
    }
    const handlePageChange = (number: number) => {
        dispatch(setCurrentPage(number))
    }


    return (
        <div className={Styles.divMayor}>
            <div className={Styles.buttons}>
                <div>
                    {currentPage > 1 && (
                        <button onClick={handlePrevious}> {'<'} </button>
                    )}
                    {Array.from({ length: totalPage }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;

                        const buttonClasses = isCurrentPage
                            ? `${Styles.pageButton} ${Styles.currentPage}`
                            : Styles.pageButton;
                        if (
                            page === 1 ||
                            page === totalPage ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                            return (
                                <button key={page} onClick={() => handlePageChange(page)} className={buttonClasses}>
                                    {page}
                                </button>
                            );
                        } else if (
                            page === currentPage - 3 ||
                            page === currentPage + 3
                        ) {
                            return <span key={page}>...</span>;
                        }
                        return null;
                    })}
                    {currentPage < totalPage && (
                        <button onClick={handleNext}> {'>'} </button>
                    )}
                </div>

            </div>
        </div>
    )
}