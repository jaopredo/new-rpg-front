import { getCookie } from 'cookies-next'

/* COMPONENTS */
import MainContainer from "@/components/MainContainer";

const Logged: React.FC = () => {

    return <MainContainer>
        { getCookie('token') ? 'Logado':'Não Logado' }
    </MainContainer>;
}

export default Logged;