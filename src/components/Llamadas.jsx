
import React, { useState, useEffect } from 'react';
import { Device } from '@twilio/voice-sdk';

const Llamadas = () => {
  const [device, setDevice] = useState(null);
  const [status, setStatus] = useState('Offline');
  const [number, setNumber] = useState('');

  // NOTE: In a real application, you would fetch this token from a server-side endpoint.
  // This token is for demonstration purposes only and will expire.
  const tempToken = 'PASTE_YOUR_TEMPORARY_TWILIO_TOKEN_HERE';

  const setupTwilioDevice = async () => {
    try {
      setStatus('Initializing...');
      const newDevice = new Device(tempToken, {
        codecPreferences: ['opus', 'pcmu'],
      });

      newDevice.on('ready', () => {
        setStatus('Ready to make calls');
        setDevice(newDevice);
      });

      newDevice.on('error', (error) => {
        console.error('Twilio Device Error:', error);
        setStatus(`Error: ${error.message}`);
      });

      newDevice.on('connect', (connection) => {
        setStatus('Call connected');
      });

      newDevice.on('disconnect', (connection) => {
        setStatus('Call disconnected');
      });

      newDevice.register();
    } catch (error) {
      console.error("An error occurred while setting up Twilio device:", error);
      setStatus('Setup failed');
    }
  };

  const makeCall = async () => {
    if (!device) {
      setStatus('Device not ready');
      return;
    }
    if (!number) {
      setStatus('Please enter a number to call');
      return;
    }
    try {
      setStatus(`Calling ${number}...`);
      await device.connect({ params: { To: number } });
    } catch (error) {
      console.error("An error occurred while making the call:", error);
      setStatus('Call failed');
    }
  };

  const hangUp = () => {
    if (device) {
      device.disconnectAll();
    }
  };

  return (
    <div className="p-4 m-4 border rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Twilio Voice</h2>
      <div className="text-center mb-4 p-2 bg-gray-100 rounded">
        <strong>Status:</strong> {status}
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={setupTwilioDevice}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={!!device}
        >
          Initialize Device
        </button>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter phone number or client ID"
          className="p-2 border rounded"
        />
        <div className="flex justify-around">
          <button
            onClick={makeCall}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            disabled={!device}
          >
            Call
          </button>
          <button
            onClick={hangUp}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
            disabled={!device}
          >
            Hang Up
          </button>
        </div>
      </div>
       <div className="mt-4 text-xs text-gray-500">
          <p><strong>Important:</strong> You need a valid Twilio Access Token for the device to initialize. Paste a temporary token in the `tempToken` variable in the code.</p>
          <p>In a real app, this token should be fetched from your backend.</p>
      </div>
    </div>
  );
};

export default Llamadas;
