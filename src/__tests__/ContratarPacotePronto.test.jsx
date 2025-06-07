import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContratarPacotePronto from '../pages/ContratarPacotePronto';
import { BrowserRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firestore from 'firebase/firestore';

// Mocks
jest.mock('../firebase', () => ({
  db: {},
  auth: {},
}));

jest.mock('react-firebase-hooks/auth', () => ({
  useAuthState: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

// Mock da geolocalização + API externa
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn((success) =>
      success({
        coords: { latitude: -22.0, longitude: -45.0 },
      })
    ),
  };

  global.fetch = jest.fn((url) => {
    if (url.includes('nominatim')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          address: {
            city: 'Santa Rita',
            state: 'Minas Gerais',
            suburb: 'Centro',
            postcode: '37540000',
          },
        }),
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });
});

describe('Teste de integração - ContratarPacotePronto', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([{ uid: '123', email: 'teste@email.com' }]);
    firestore.addDoc.mockClear();
  });

  it('envia um pedido corretamente ao preencher e confirmar', async () => {
    render(
      <BrowserRouter>
        <ContratarPacotePronto />
      </BrowserRouter>
    );

    // Preencher número de pessoas
    fireEvent.change(screen.getByTestId('input-pessoas'), {
      target: { value: '60' },
    });

    // Simular seleção de data (usando Date real)
    const novaData = new Date(2025, 11, 12); // 12/12/2025
    fireEvent.click(screen.getByTestId('input-data')); // abre o calendário
    fireEvent.change(screen.getByTestId('input-data'), {
      target: { value: '12/12/2025' },
    });

    // Clicar em usar localização
    fireEvent.click(screen.getByTestId('btn-localizacao'));

    // Esperar a cidade/estado serem preenchidos
    await waitFor(() => {
      expect(screen.getByTestId('input-cidade').value).toBe('Santa Rita');
      expect(screen.getByTestId('input-estado').value).toBe('Minas Gerais');
    });

    // Preencher bairro e número
    fireEvent.change(screen.getByTestId('input-bairro'), {
      target: { value: 'Centro' },
    });
    fireEvent.change(screen.getByTestId('input-numero'), {
      target: { value: '123' },
    });

    // Confirmar
    const botao = screen.getByTestId('btn-contratar');
    fireEvent.click(botao);

    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalledTimes(1);
    });
  });
});
