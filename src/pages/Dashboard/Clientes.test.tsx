import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Clientes } from './Clientes';

describe('Clientes', () => {
  beforeEach(() => {
    localStorage.setItem('tera_token', 'token-teste');
    globalThis.fetch = jest.fn();
  });

  it('lista clientes autenticados com o header Bearer correto', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          data: [
            { id: 1, name: 'Ana Souza', email: 'ana@tera.com', doc: '12345678901', phone: '11987654321' },
          ],
        },
      }),
    });

    render(<Clientes />);

    expect(await screen.findByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('123.456.789-01')).toBeInTheDocument();
    expect(screen.getByText('(11) 98765-4321')).toBeInTheDocument();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/auth/customer/list',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-teste' }),
      }),
    );
  });

  it('cria um cliente novo e atualiza a lista', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { data: [] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { data: [{ id: 2, name: 'Novo Cliente', email: 'novo@tera.com', doc: '', phone: '' }] },
        }),
      });

    render(<Clientes />);
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: '+ Novo Cliente' }));

    await userEvent.type(screen.getByPlaceholderText('Nome Completo'), 'Novo Cliente');
    await userEvent.type(screen.getByPlaceholderText('E-mail'), 'novo@tera.com');
    await userEvent.type(screen.getByPlaceholderText('CPF ou CNPJ (apenas números)'), '12345678901');
    await userEvent.type(screen.getByPlaceholderText('Telefone (apenas números)'), '11987654321');

    await userEvent.click(screen.getByRole('button', { name: 'Salvar Cliente' }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(3));
    expect(await screen.findByText('Novo Cliente')).toBeInTheDocument();
  });

  it('nao quebra a tela quando a listagem falha', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'));

    render(<Clientes />);

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('Ana Souza')).not.toBeInTheDocument();
  });
});
