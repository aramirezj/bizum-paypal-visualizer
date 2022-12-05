/**
 * Objeto que representa la paginación en un listado
 */
 export interface Pagina {
    /**
     * Número de registros en la página actual
     */
    numeroRegistrosPagina?: number;
    /**
     * Número total de registros
     */
    numeroRegistrosTotal?: number;
    /**
     * Número total de páginas
     */
    numeroPaginasTotal?: number;
    /**
     * Número de página actual
     */
    numeroPagina?: number;
}
