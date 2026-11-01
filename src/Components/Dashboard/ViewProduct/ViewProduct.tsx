
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../Utils/Redux/Hooks";
import { setCurrentPage } from "../../../Utils/Redux/paginationSlice";
import Pagination from "../../Pagination/Pagination";
import Styles from './ViewProduct.module.css';

export default function ViewProduct() {

    const allProducts = useAppSelector((state) => state.products.products);
    const { currentPage, elementsPerPage } = useAppSelector((state) => state.pagination);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("todos");

    const descriptionLimit = 80;

    const filteredProducts = allProducts.filter((oneproduct) => {

        const searchValue = search.toLowerCase();

        const matchesSearch =
            oneproduct.name.toLowerCase().includes(searchValue) ||
            oneproduct.category.toLowerCase().includes(searchValue) ||
            (oneproduct.identification ?? "").toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "todos" ||
            (statusFilter === "activos" && oneproduct.active) ||
            (statusFilter === "inactivos" && !oneproduct.active);

        return matchesSearch && matchesStatus;
    });

    const currentProducts = filteredProducts.slice(
        (currentPage - 1) * elementsPerPage,
        currentPage * elementsPerPage
    );

    useEffect(() => {
        dispatch(setCurrentPage(1));
    }, [search, statusFilter]);

    const truncateDescription = (description: string) => {
        if (description.length <= descriptionLimit) return description;
        return `${description.slice(0, descriptionLimit)}...`;
    };

    return (
        <div className={Styles.divMayor}>

            <div className={Styles.filtersContainer}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, categoría o identificador..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="todos">Todos los estados</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>

            <div className={Styles.titlesContainer}>
                <label>Fotos</label>
                <label>Nombre</label>
                <label>Categoria</label>
                <label>Estado</label>
                <label>Descripción</label>
                <label>Identificador</label>
            </div>

            <div className={Styles.productsContainer}>
                {currentProducts.map((oneproduct) => (
                    <div
                        key={oneproduct.id}
                        className={Styles.oneProduct}
                        onClick={() => navigate(`/dash/detail/${oneproduct.id}`)}
                    >
                        <div className={Styles.imageContainer}>
                            <img
                                className={Styles.image}
                                src={oneproduct.photos[0]}
                                alt={oneproduct.name}
                            />
                        </div>

                        <label>{oneproduct.name}</label>
                        <label>{oneproduct.category}</label>
                        <label>{oneproduct.active ? "activo" : "inactivo"}</label>
                        <label title={oneproduct.description}>
                            {truncateDescription(oneproduct.description)}
                        </label>
                        <label>{oneproduct.identification ?? " - "}</label>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <p>No se encontraron productos.</p>
                )}
            </div>

            <Pagination productsToPaginate={filteredProducts} />

            <p className={Styles.productsCount}>
                Mostrando {currentProducts.length} de {filteredProducts.length} productos
            </p>

        </div>
    );
}
