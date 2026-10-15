import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { ContactForm } from './ContactForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

async function preencherFormulario() {
  await userEvent.type(screen.getByPlaceholderText('Nome'), 'Ana Souza');
  await userEvent.type(screen.getByPlaceholderText('E-mail'), 'ana@tera.com');
  await userEvent.type(screen.getByPlaceholderText('Telefone'), '11987654321');
  await userEvent.type(screen.getByPlaceholderText('CPF/CNPJ'), '12345678901');
}

describe('ContactForm', () => {
  it('envia o formulario com sucesso e limpa os campos', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} });

    render(<ContactForm />);
    await preencherFormulario();

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText('Cadastro realizado com sucesso!')).toBeInTheDocument();
    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:3001/api/create/customer', {
      name: 'Ana Souza',
      email: 'ana@tera.com',
      phone: '11987654321',
      doc: '12345678901',
    });
    expect(screen.getByPlaceholderText('Nome')).toHaveValue('');
  });

  it('mostra mensagem de erro vinda da API', async () => {
    mockedAxios.isAxiosError.mockReturnValue(true);
    mockedAxios.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: 'E-mail já cadastrado' } },
    });

    render(<ContactForm />);
    await preencherFormulario();

    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText('E-mail já cadastrado')).toBeInTheDocument();
  });
});
