import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { EsqueciSenha } from './EsqueciSenha';

function renderPage() {
  return render(
    <MemoryRouter>
      <EsqueciSenha />
    </MemoryRouter>,
  );
}

describe('EsqueciSenha', () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  it('envia o email correto para o backend e mostra a mensagem de retorno', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Se este email estiver cadastrado, você receberá um link de recuperação.',
      }),
    });

    renderPage();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/auth/forgot-password',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'user@tera.com' }),
      }),
    );

    expect(
      await screen.findByText('Se este email estiver cadastrado, você receberá um link de recuperação.'),
    ).toBeInTheDocument();
  });

  it('mostra o estado de carregamento durante o envio', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    (globalThis.fetch as jest.Mock).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    renderPage();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }));

    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();

    resolveFetch({ ok: true, json: async () => ({ message: 'ok' }) });

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Enviar link de recuperação' })).not.toBeDisabled(),
    );
  });

  it('mostra erro de conexao quando o fetch falha', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('network'));

    renderPage();

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'user@tera.com');
    await userEvent.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }));

    expect(await screen.findByText('Erro de conexão com o servidor.')).toBeInTheDocument();
  });
});
