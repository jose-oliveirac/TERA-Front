import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Login } from './Login';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/auth']}>
      <Routes>
        <Route path="/auth" element={<Login />} />
        <Route path="/dashboard" element={<div>Tela do Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  it('autentica com sucesso, grava o token e navega para /dashboard', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'token-123' }),
    });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'senha12345');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Tela do Dashboard')).toBeInTheDocument();
    });

    expect(localStorage.getItem('tera_token')).toBe('token-123');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/user/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('mostra mensagem de erro quando as credenciais sao invalidas', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ mensagem: 'Credenciais invalidas' }),
    });

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'senhaerrada');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Credenciais invalidas')).toBeInTheDocument();
    expect(localStorage.getItem('tera_token')).toBeNull();
  });

  it('mostra erro de conexao quando o fetch falha', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('network error'));

    renderLogin();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'senha12345');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Erro de conexão com o servidor.')).toBeInTheDocument();
  });

  it('exibe o link para recuperar senha', () => {
    renderLogin();
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });
});
