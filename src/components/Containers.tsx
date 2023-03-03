import styled from "styled-components"

export const CharContainer = styled.div`
    display: grid;
    gap: 10px;
    grid-template-columns: 37.5% 37.5% auto;
    grid-template-rows: 20vh auto auto auto auto;
    grid-template-areas:
        "basic basic status"
        "attrs attrs specs"
        "saude movimento specs"
        "defesa reacoes specs"
        "nivel dados specs";
    font-family: Arial, Helvetica, sans-serif;
    width: 100%;
    height: 100%;
`