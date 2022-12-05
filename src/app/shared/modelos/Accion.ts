import { BehaviorSubject } from 'rxjs';
import { AccionCondicion } from './AccionCondicion';

/** Clase utilizada por las tablas para mostrar los iconos de las acciones y gestionar los eventos */
export class Accion {
    /** Catálogo de acciones predefinidas con su descripción e icono */
    static catalogo: object =
        {
            eliminar: { descripcion: 'Eliminar elemento', icono: 'clear' },
            eliminarT: { descripcion: 'Eliminar elemento', icono: 'clear' },
            configurar: { descripcion: 'Configurar elemento', icono: 'storage' },
            editar: { descripcion: 'Editar elemento', icono: 'edit' },
            editarT: { descripcion: 'Editar elemento', icono: 'edit' },
            addGestion: { descripcion: 'Añadir gestión', icono: 'add' },
            editIJ: { descripcion: 'Configurar Instrumento Jurídico', icono: 'edit' },
            ver: { descripcion: 'Inspeccionar elemento', icono: 'remove_red_eye' },
            listado: { descripcion: 'Abrir listado', icono: 'remove_red_eye' },
            subir: { descripcion: 'Subir elemento', icono: 'keyboard_arrow_up', },
            bajar: { descripcion: 'Bajar elemento', icono: 'keyboard_arrow_down' },
            buscar: { descripcion: 'Buscar elemento', icono: 'search' },
            addPerson: { descripcion: 'Añadir interesado', icono: 'person_add_alt_1' },
            searchPerson: { descripcion: 'Consultar interesados', icono: 'person_search' },
            addLocation: { descripcion: 'Gestionar ámbitos', icono: 'add_location_alt' },
            presentar: { descripcion: 'Presentar la solicitud', icono: 'grading' },
            guardar: { descripcion: 'Guardar', icono: 'save' },
            guardarSolicitud: { descripcion: 'Guardar solicitud', icono: 'save' },
            continuar: { descripcion: 'Continuar', icono: 'keyboard_arrow_right' },
            volver: { descripcion: 'Volver', icono: 'keyboard_arrow_left' },
            cancelar: { descripcion: 'Cancelar', icono: 'clear' },
            diagrama: { descripcion: 'Visualizar Procedimiento', icono: 'account_tree' },
            inspeccionar: { descripcion: 'Inspeccionar', icono: 'search' },
            accederSolicitud: { descripcion: 'Acceder a la solicitud', icono: 'assignment' },
            addCentro: { descripcion: 'Añadir centro', icono: 'home_work' },
            addAccionFormativa: { descripcion: 'Añadir acción formativa', icono: 'add' },
            editOcupaciones: { descripcion: 'Editar ocupaciones de la especialidad', icono: 'menu_book' },
            mostrarRepresentantes: { descripcion: 'Mostrar los datos del representante', icono: 'account_circle' },
            infoComunicacion: { descripcion: 'Mostrar los medios de comunicación administrativa', icono: 'phone' },
            infoContacto: { descripcion: 'Muestra la información de contacto', icono: 'contact_mail' },
            infoDireccion: { descripcion: 'Muestra la dirección', icono: 'domain' },
            validaDoc: { descripcion: 'Validar la documentación', icono: 'thumb_up_alt' },
            invalidaDoc: { descripcion: 'Invalidar la documentación', icono: 'thumb_down_alt' },
            noNecesario: { descripcion: 'Documentos no necesarios', icono: 'disabled_by_default' },
            rehacer: { descripcion: 'Rehacer', icono: 'repeat' },
            crearDeclaracion: { descripcion: 'Crear declaracion', icono: 'add' },
            crearSubcriterio: { descripcion: 'Añadir subcriterio', icono: 'add' },
            solicitar: { descripcion: 'Solicitar de nuevo', icono: 'restore_page' },
            empaquetar: { descripcion: 'Empaquetar', icono: 'inventory' },
            editarDescripcion: { descripcion: 'Editar descripción', icono: 'description' },
            aulas: { descripcion: 'Gestión de aulas', icono: 'meeting_room' },
            certificaciones: { descripcion: 'Certificaciones de Calidad', icono: 'military_tech' },
            dotaciones: { descripcion: 'Dotaciones', icono: 'phonelink' },
            desmarcarPrincipal: { descripcion: 'Ya es el representante principal', icono: 'star' },
            marcarPrincipal: { descripcion: 'Marcar representante como principal', icono: 'star_border' }
        };
    /** Observer para que se suscriba el componente AccionTabla */
    observerCondiciones: BehaviorSubject<any>;
    /** Condiciones que puede tener una Accion */
    condiciones: AccionCondicion[];
    constructor(
        public funcion: string,
        public descripcion?: string,
        public icono?: string,
        public disabled?: boolean

    ) {
        this.descripcion = Accion.catalogo[this.funcion].descripcion;
        this.icono = Accion.catalogo[this.funcion].icono;
    }
    /**
     * Agrega una serie de condiciones a una serie de acciones, instanciando su BehaviourSubject para luego poder suscribirse
     *
     * @param condiciones Condiciones a asociar
     * @param acciones Acciones a recibir condiciones
     */
    static agregaCondicionesAAcciones(condiciones: AccionCondicion[], acciones: Accion[]): void {
        condiciones.forEach(condicion => {
            const behaviour = new BehaviorSubject(0);
            acciones.forEach(accion => {
                accion.observerCondiciones = accion.observerCondiciones ? accion.observerCondiciones : behaviour;
                accion.condiciones = accion.condiciones ? accion.condiciones : [];
                accion.condiciones.push(condicion);
            });
        });
    }


}
