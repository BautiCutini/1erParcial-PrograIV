
    import {
        createContext,
        useContext,
        useReducer,
        type ReactNode,
    } from 'react';
    
    import type { Producto } from '../schemas/producto';
    import {
        carritoReducer,
        carritoInicial,
        type ItemCarrito,
    } from '../reducers/carritoReducer';
    
    
    interface CarritoContextType {
        items: ItemCarrito[];
        agregar: (producto: Producto) => void;
        incrementar: (productoId: string) => void;
        decrementar: (productoId: string) => void;
        quitar: (productoId: string) => void;
        vaciar: () => void;
    }
    
    // Contexto.
    const CarritoContext = createContext<CarritoContextType | undefined>(
        undefined,
    );
    
    // Estado. 
    interface CarritoProviderProps {
        children: ReactNode;
    }
    
    export function CarritoProvider({ children }: CarritoProviderProps) {
        const [items, dispatch] = useReducer(carritoReducer, carritoInicial);
        
        const agregar = (producto: Producto) => {
            dispatch({ type: 'AGREGAR', producto });
        };
        
        const incrementar = (productoId: string) => {
            dispatch({ type: 'INCREMENTAR', productoId });
        };
        
        const decrementar = (productoId: string) => {
            dispatch({ type: 'DECREMENTAR', productoId });
        };
        
        const quitar = (productoId: string) => {
            dispatch({ type: 'QUITAR', productoId });
        };
        
        const vaciar = () => {
            dispatch({ type: 'VACIAR' });
        };
        
        return (
            <CarritoContext.Provider
                value={{ items, agregar, incrementar, decrementar, quitar, vaciar }}
            >
            {children}
            </CarritoContext.Provider>
        );
    }
    
    
    export function useCarrito(): CarritoContextType {
        const contexto = useContext(CarritoContext);
        
        if (!contexto) {
            throw new Error('useCarrito debe utilizarse dentro de CarritoProvider');
        }
        
        return contexto;
    }
