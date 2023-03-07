import { render, screen, waitFor } from "@testing-library/react";
import { pokemonMock } from "./pokemonMock";
import axios from "axios";
import Pokecard from "../components/Pokecard";
import userEvent  from "@testing-library/user-event";


jest.mock("axios")

//Props mockadas

const urlMock = "https://pokeapi.co/api/v2/pokemon/6/"
//Resposta do axios.get mockado

const openModalMock = jest.fn()

const axiosResponseMock = {
    data: pokemonMock
}

describe("Pokecard", () => {
    test("renderiza o card", async () => {
        axios.get.mockResolvedValueOnce(axiosResponseMock)

        render(<Pokecard
            url={urlMock}
            openModal={openModalMock}
        />)
        // screen.debug()
        
        await waitFor(() => {})
        // screen.debug()
    })

    test("card renderiza após carregamento", async () => {
        axios.get.mockResolvedValueOnce(axiosResponseMock)

        render(<Pokecard
            url={urlMock}
            openModal={openModalMock}
        />)
        // screen.logTestingPlaygroundURL()
       const loading = screen.getByText(/loading\.\.\./i)
       expect(loading).toBeInTheDocument()

        expect(screen.queryByText(/charizard/i)).not.toBeInTheDocument()

        await waitFor(() => {
            const title = screen.getByRole('heading', {
                name: /charizard/i
            })
            expect(title).toBeInTheDocument()
            const image = screen.getByRole('img', {
                name: /charizard/i
            })
            expect(image).toBeInTheDocument()
            const type1 = screen.getByText(/fire/i)
            expect(type1).toBeInTheDocument()
            const type2 = screen.getByText(/flying/i)
            expect(type2).toBeInTheDocument()

        })
        // screen.logTestingPlaygroundURL()
        expect(screen.queryByText("Loading")).not.toBeInTheDocument()
    })

    test("dispara função que habilita o modal", async () => {
        const user = userEvent.setup()
        axios.get.mockResolvedValueOnce(axiosResponseMock)

        render(<Pokecard
            url={urlMock}
            openModal={openModalMock}
        />)
        await waitFor(() => {})
        const card = screen.getByRole('article')
        await user.click(card)

        expect(openModalMock).toBeCalledTimes(1)
    })
})
