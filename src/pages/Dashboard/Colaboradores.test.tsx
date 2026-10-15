import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Colaboradores } from './Colaboradores';

describe('Colaboradores', () => {
  beforeEach(() => {
    localStorage.setItem('tera_token', 'token-teste');
    globalThis.fetch = jest.fn();
  });

  it('lista colaboradores com o token correto', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { data: [{ id: 1, name: 'Joao Silva', email: 'joao@tera.com' }] } }),
    });

    render(<Colaboradores />);

    expect(await screen.findByText('Joao Silva')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/auth/user/list',
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token-teste' }) }),
    );
  });

  it('cria um novo colaborador', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { data: [] } }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { data: [{ id: 2, name: 'Maria', email: 'maria@tera.com' }] } }),
      });

    render(<Colaboradores />);
    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getByRole('button', { name: '+ Novo Colaborador' }));
    await userEvent.type(screen.getByPlaceholderText('Nome'), 'Maria');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'maria@tera.com');
    await userEvent.type(screen.getByPlaceholderText('Senha'), 'senha12345');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(3));
    expect(await screen.findByText('Maria')).toBeInTheDocument();
  });

  it('abre o modal de edicao preenchido e envia PUT ao salvar', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { data: [{ id: 5, name: 'Carlos', email: 'carlos@tera.com' }] } }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { data: [{ id: 5, name: 'Carlos Atualizado', email: 'carlos@tera.com' }] },
        }),
      });

    render(<Colaboradores />);
    await screen.findByText('Carlos');

    await userEvent.click(screen.getByRole('button', { name: 'Editar colaborador' }));

    const nomeInput = screen.getByPlaceholderText('Nome') as HTMLInputElement;
    expect(nomeInput.value).toBe('Carlos');

    await userEvent.clear(nomeInput);
    await userEvent.type(nomeInput, 'Carlos Atualizado');
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/user/5',
        expect.objectContaining({ method: 'PUT' }),
      );
    });
  });

  it('exclui um colaborador ao clicar no botao de excluir', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { data: [{ id: 7, name: 'Beatriz', email: 'bia@tera.com' }] } }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Colaborador removido!' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: { data: [] } }) });

    render(<Colaboradores />);
    await screen.findByText('Beatriz');

    await userEvent.click(screen.getByRole('button', { name: 'Excluir colaborador' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/user/7',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
