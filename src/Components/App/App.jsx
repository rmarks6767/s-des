/* eslint-disable import/extensions */
import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Tabs,
  Tab,
  TextField,
  Typography,
} from '@material-ui/core';
import { stringToBits, binaryToDecimal } from '../../DES/helpers.js';
import { encrypt } from '../../DES/des.js';
import './App.css';
import { decrypt } from '../../DES/index.js';

const App = () => {
  const [tab, setTab] = useState(0);
  const [steps, setSteps] = useState({});

  const [plaintext, setPlaintext] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [ciphertext, setCiphertext] = useState();

  const [encryptedText, setEncryptedText] = useState('');
  const [decryptionkey, setDecryptionKey] = useState('');
  const [decryptedText, setDecryptedText] = useState();

  const encryptMessage = (pText, key) => {
    const bits = stringToBits(pText.toUpperCase());
    let ct = '';

    bits.forEach((bit, i) => {
      const { result: res, steps: s } = encrypt(bit, key);

      if (i === 0) {
        setSteps({
          Start: [`The following shows how the encryption for the first letter, ${String.fromCharCode(binaryToDecimal(bit))}, or ${bit} expressed as binary, works.`],
          ...s,
        });
      }

      ct += String.fromCharCode(binaryToDecimal(res));
    });

    setCiphertext(ct);
  };

  const decryptMessage = (cText, key) => {
    const cipherBits = stringToBits(cText);
    let text = '';

    cipherBits.forEach((bit, i) => {
      const { result: res, steps: s } = decrypt(bit, key);

      if (i === 0) {
        setSteps({
          Start: [`The following shows how the decryption for the first letter, ${String.fromCharCode(binaryToDecimal(bit))}, or ${bit} expressed as binary, works.`],
          ...s,
        });
      }
      text += String.fromCharCode(binaryToDecimal(res));
    });

    setDecryptedText(text);
  };

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  return (
    <div className="app">
      <Typography className="title general-padding" variant="h1" component="h2">
        Implementation of a Mini-DES
      </Typography>
      <Typography className="title general-padding" variant="h5" component="h5">
        Project by Vivian Nowka-Keane and River Marks
      </Typography>
      <Paper className="general-padding" square>
        <Tabs
          centered
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(_, newValue) => {
            setTab(newValue);
            setSteps({});
            setPlaintext('');
            setEncryptionKey('');
            setEncryptedText('');
            setDecryptionKey('');
            setCiphertext();
            setDecryptedText();
          }}
        >
          <Tab label="Encrypt" />
          <Tab label="Decrypt" />
        </Tabs>
      </Paper>
      {tab === 0 && (
      <div className="input-area">
        <TextField
          className="generaler-padding"
          placeholder="Hello World"
          onChange={(e) => setPlaintext(e.target.value)}
          id="outlined-plaintext"
          label="Enter text to encrypt"
          variant="outlined"
          value={plaintext}
        />
        <TextField
          className="generaler-padding"
          placeholder="1101001001"
          onChange={(e) => setEncryptionKey(e.target.value)}
          id="outlined-encryption-key"
          label="Enter key to use"
          variant="outlined"
          value={encryptionKey}
        />
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={() => encryptMessage(plaintext, encryptionKey)}>
            Encrypt
          </Button>
          <Button
            onClick={() => {
              setPlaintext('Hello World');
              setEncryptionKey('1010101010');
              encryptMessage('Hello World', '1010101010');
            }}
          >
            Try an Example Encryption
          </Button>
        </ButtonGroup>
      </div>
      )}
      {tab === 1 && (
      <div className="input-area">
        <TextField
          className="generaler-padding"
          placeholder="Ciphertext"
          onChange={(e) => setEncryptedText(e.target.value)}
          id="outlined-ciphertext"
          label="Enter text to decrypt"
          variant="outlined"
          value={encryptedText}
        />
        <TextField
          className="generaler-padding"
          placeholder="1101001001"
          onChange={(e) => setDecryptionKey(e.target.value)}
          id="outlined-decryption-key-field"
          label="Enter key that was used"
          variant="outlined"
          value={decryptionkey}
        />
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={() => decryptMessage(encryptedText, decryptionkey)}>
            Decrypt
          </Button>
          <Button
            onClick={() => {
              setEncryptedText('òDWW¡Ò(¡ÙWË');
              setDecryptionKey('1010101010');
              decryptMessage('òDWW¡Ò(¡ÙWË', '1010101010');
            }}
          >
            Try an Example Decryption
          </Button>
        </ButtonGroup>
      </div>
      )}
      {Object.keys(steps).length !== 0 && (
        <div>
          <Typography className="general-padding" variant="h3" component="h3">
            Steps needed to complete this
            {' '}
            {tab === 0 ? 'Encryption' : 'Decryption'}
            :
          </Typography>
          {ciphertext && (
            <Typography className="general-padding" variant="h4" component="h5">
              <b>{plaintext}</b>
              {' '}
              encrypts to
              {' '}
              <b>{ciphertext}</b>
            </Typography>
          )}
          {decryptedText && (
            <Typography className="general-padding" variant="h4" component="h5">
              <b>{encryptedText}</b>
              {' '}
              decrypts to
              {' '}
              <b>{decryptedText}</b>
            </Typography>
          )}
          <Stepper className="general-padding stepper-border" activeStep={activeStep} orientation="vertical">
            {Object.keys(steps).map((key) => (
              <Step key={key}>
                <StepLabel>{key}</StepLabel>
                <StepContent>
                  <div>
                    <div>
                      <ol>
                        {steps[key].map((text) => (
                          <li key={text}>{text}</li>
                        ))}
                      </ol>
                      {activeStep !== 0 && <Button onClick={handleBack}>Back</Button>}
                      {activeStep !== Object.keys(steps).length - 1 && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </div>
      )}

    </div>
  );
};

export default App;
