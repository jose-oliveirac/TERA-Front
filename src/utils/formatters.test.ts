import { formatarDoc, formatarTelefone } from './formatters';

describe('formatarDoc', () => {
  it('formata CPF com 11 digitos', () => {
    expect(formatarDoc('12345678901')).toBe('123.456.789-01');
  });

  it('formata CNPJ com 14 digitos', () => {
    expect(formatarDoc('12345678000199')).toBe('12.345.678/0001-99');
  });

  it('remove caracteres nao numericos antes de formatar', () => {
    expect(formatarDoc('123.456.789-01')).toBe('123.456.789-01');
  });

  it('retorna vazio quando o valor for vazio', () => {
    expect(formatarDoc('')).toBe('');
  });

  it('retorna o valor original quando o tamanho for invalido', () => {
    expect(formatarDoc('123')).toBe('123');
  });
});

describe('formatarTelefone', () => {
  it('formata telefone fixo com 10 digitos', () => {
    expect(formatarTelefone('1123456789')).toBe('(11) 2345-6789');
  });

  it('formata celular com 11 digitos', () => {
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
  });

  it('remove caracteres nao numericos antes de formatar', () => {
    expect(formatarTelefone('(11) 98765-4321')).toBe('(11) 98765-4321');
  });

  it('retorna vazio quando o valor for vazio', () => {
    expect(formatarTelefone('')).toBe('');
  });

  it('retorna o valor original quando o tamanho for invalido', () => {
    expect(formatarTelefone('123')).toBe('123');
  });
});
