import { useDisclosure, UseDisclosureReturn } from "@chakra-ui/react";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { createContext, ReactNode, useContext } from "react";

interface SidebarDrawerProviderProps {
    children: ReactNode;
}

type SidebarDrawerContextData = UseDisclosureReturn

const SidebarDrawerContext = createContext({} as SidebarDrawerContextData);

// criar contexto para que seja possível usar componentes compartilhados
export function SidebarDrawerProvider({ children }: SidebarDrawerProviderProps) {
    // retorna algumas coisas do drawer do chakra
    const disclosure = useDisclosure()
    const router = useRouter()

    // toda vez que mudar de rota, fecha a sidebar
    useEffect(() => {
        disclosure.onClose()
    }, [router.asPath]) // router.asPath é o caminho da rota

    return (
        <SidebarDrawerContext.Provider value={disclosure}>
            {children}
        </SidebarDrawerContext.Provider>
    )
}

export const useSidebarDrawer = () => useContext(SidebarDrawerContext);