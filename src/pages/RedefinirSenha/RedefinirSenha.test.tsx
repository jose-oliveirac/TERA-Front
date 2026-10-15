import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RedefinirSenha } from './RedefinirSenha';

function renderPage(token = 'token-valido') {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <Routes>
        <Route path="/reset-password" element={<RedefinirSenha />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RedefinirSenha', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  it('mostra "Verificando link..." enquanto valida o token', () => {
    (globalThis.fetch as jest.Mock).mockReturnValueOnce(new Promise(() => {}));
    renderPage();
    expect(screen.getByText('Verificando link...')).toBeInTheDocument();
  });

  it('mostra erro quando o token e invalido', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    renderPage('token-invalido');

    expect(await screen.findByText('Link inválido ou expirado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pedir um novo link' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });

  it('mostra o formulario quando o token e valido', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'user@tera.com' }),
    });
    renderPage();

    expect(await screen.findByText('Nova senha')).toBeInTheDocument();
  });

  it('mostra erro quando as senhas nao coincidem, sem chamar o backend de novo', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({}) });
    renderPage();

    await screen.findByText('Nova senha');

    const [senha, confirmar] = screen.getAllByPlaceholderText('••••••••');
    await userEvent.type(senha, 'senha12345');
    await userEvent.type(confirmar, 'senhadiferente');
    await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }));

    expect(await screen.findByText('As senhas não coincidem.')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('envia token e senha corretos quando as senhas coincidem', async () => {
    (globalThis.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Senha alterada com sucesso.' }),
      });

    renderPage('token-valido');
    await screen.findByText('Nova senha');

    const [senha, confirmar] = screen.getAllByPlaceholderText('••••••••');
    await userEvent.type(senha, 'senhaNova123');
    await userEvent.type(confirmar, 'senhaNova123');
    await userEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenLastCalledWith(
        'http://localhost:3001/api/auth/reset-password',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'token-valido', password: 'senhaNova123' }),
        }),
      );
    });

    expect(await screen.findByText('Senha alterada com sucesso.')).toBeInTheDocument();
  });
});
