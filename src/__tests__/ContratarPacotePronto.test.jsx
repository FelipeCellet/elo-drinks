import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContratarPacotePronto from '../pages/ContratarPacotePronto';
import { BrowserRouter } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import * as firestore from 'firebase/firestore';

// Mock do Firebase e Auth
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

// Mock de useParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

// Suprimir erros no console
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn((success) =>
      success({
        coords: { latitude: -22.0, longitude: -45.0 },
      })
    ),
  };
});

describe('Teste de integração - ContratarPacotePronto', () => {
  beforeEach(() => {
    useAuthState.mockReturnValue([{ uid: '123', email: 'teste@email.com' }]);
  });

  it('envia um pedido corretamente ao preencher e confirmar', async () => {
    render(
      <BrowserRouter>
        <ContratarPacotePronto />
      </BrowserRouter>
    );

    // Preenche os campos
    fireEvent.change(screen.getByPlaceholderText(/Ex: 50 pessoas/i), {
      target: { value: '60' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Bairro/i), {
      target: { value: 'Centro' },
    });

    fireEvent.change(screen.getByPlaceholderText(/Número/i), {
      target: { value: '123' },
    });

    // O DatePicker pode precisar ser simulado com fireEvent.change ou com lib auxiliar
    fireEvent.change(screen.getByPlaceholderText(/Data do evento/i), {
      target: { value: '2025-12-31' },
    });

    // Confirma contratação
    fireEvent.click(screen.getByRole('button', { name: /confirmar contratação/i }));

    // Espera o envio do pedido
    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalled();
    });
  });
});
