/* eslint-disable import/extensions */
import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Link,
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

const isBinary = (arr) => {
  let isBin = true;
  arr.forEach((a) => {
    if (a !== '0' && a !== '1') isBin = false;
  });

  return isBin;
};

const App = () => {
  const [tab, setTab] = useState(0);
  const [steps, setSteps] = useState({});
  const [errors, setErrors] = useState({
    key: null,
    text: null,
  });

  const [plaintext, setPlaintext] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [ciphertext, setCiphertext] = useState();
  const [ptAsBinary, setPtAsBinary] = useState();

  const [encryptedText, setEncryptedText] = useState('');
  const [decryptionkey, setDecryptionKey] = useState('');
  const [decryptedText, setDecryptedText] = useState();

  const encryptMessage = (pText, key) => {
    let bits;
    const isBinaryBool = isBinary([...pText]);

    if (isBinaryBool) bits = pText.match(/.{1,8}/g);
    else bits = stringToBits(pText);

    let ct = '';
    let pt = '';

    bits.forEach((bit, i) => {
      const { result: res, steps: s } = encrypt(bit, key);

      if (i === 0) {
        setSteps({
          Start: [`The following shows how the encryption for ${isBinaryBool ? bit : ` the first letter, ${String.fromCharCode(binaryToDecimal(bit))}, or ${bit} expressed as binary`}, works.`],
          ...s,
        });
      }

      pt += `${bit} `;
      ct += `${res} `;
    });

    setPtAsBinary(pt);
    setCiphertext(ct);
  };

  const decryptMessage = (cText, key) => {
    const cipherBits = cText.split(' ');
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
      <Typography className="title title-title general-padding" variant="h1" component="h2">
        Implementation of a Mini-DES
      </Typography>
      <Typography className="title general-padding" variant="h5" component="h5">
        Project by Vivian Nowka-Keane and River Marks
      </Typography>
      <Paper className="general-padding" square>
        <Tabs
          centered
          value={tab}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={(_, newValue) => {
            setActiveStep(0);
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
          <Tab label="The Code" />
        </Tabs>
      </Paper>
      {tab === 0 && (
      <div className="input-area">
        <TextField
          error={errors.text}
          helperText={errors.text}
          className="generaler-padding"
          placeholder="Hello World"
          onChange={(e) => {
            setPlaintext(e.target.value);
            setErrors({
              ...errors,
              text: null,
            });
          }}
          id="outlined-plaintext"
          label="Enter text to encrypt"
          variant="outlined"
          value={plaintext}
        />
        <TextField
          className="generaler-padding"
          error={errors.key}
          helperText={errors.key}
          placeholder="1010101010"
          onChange={(e) => {
            setEncryptionKey(e.target.value);
            setErrors({
              ...errors,
              key: null,
            });
          }}
          id="outlined-encryption-key"
          label="Enter key to use"
          variant="outlined"
          value={encryptionKey}
        />
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={() => {
            let anyError = false;
            let newErrors = {};

            if (plaintext.length === 0) {
              newErrors = {
                ...newErrors,
                text: 'Must not be empty.',
              };
              anyError = true;
            }

            if (isBinary([...plaintext]) && plaintext.length % 8 !== 0) {
              newErrors = {
                ...newErrors,
                text: 'Binary text must be in blocks of 8.',
              };
              anyError = true;
            }

            if (!isBinary([...encryptionKey])) {
              newErrors = {
                ...newErrors,
                key: 'The key must be expressed in binary.',
              };
              anyError = true;
            }

            if (encryptionKey.length !== 10) {
              newErrors = {
                ...newErrors,
                key: 'The key must be 10 in length.',
              };
              anyError = true;
            }

            if (encryptionKey.length === 0) {
              newErrors = {
                ...newErrors,
                key: 'Must not be empty.',
              };
              anyError = true;
            }

            if (!anyError) encryptMessage(plaintext, encryptionKey);
            else setErrors(newErrors);
          }}
          >
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
          error={errors.text}
          helperText={errors.text}
          className="generaler-padding"
          placeholder="Ciphertext"
          onChange={(e) => {
            setEncryptedText(e.target.value);
            setErrors({
              ...errors,
              text: null,
            });
          }}
          id="outlined-ciphertext"
          label="Enter text to decrypt"
          variant="outlined"
          value={encryptedText}
        />
        <TextField
          error={errors.key}
          helperText={errors.key}
          className="generaler-padding"
          placeholder="1010101010"
          onChange={(e) => {
            setDecryptionKey(e.target.value);
            setErrors({
              ...errors,
              key: null,
            });
          }}
          id="outlined-decryption-key-field"
          label="Enter key that was used"
          variant="outlined"
          value={decryptionkey}
        />
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">

          <Button onClick={() => {
            let anyError = false;
            let newErrors = {};

            if (encryptedText.length === 0) {
              newErrors = {
                ...newErrors,
                text: 'Must not be empty.',
              };
              anyError = true;
            }

            if (isBinary([...encryptedText]) && encryptedText.length % 8 !== 0) {
              newErrors = {
                ...newErrors,
                text: 'Binary text must be in blocks of 8.',
              };
              anyError = true;
            }

            if (!isBinary([...decryptionkey])) {
              newErrors = {
                ...newErrors,
                key: 'The key must be expressed in binary.',
              };
              anyError = true;
            }

            if (decryptionkey.length !== 10) {
              newErrors = {
                ...newErrors,
                key: 'The key must be 10 in length.',
              };
              anyError = true;
            }

            if (decryptionkey.length === 0) {
              newErrors = {
                ...newErrors,
                key: 'Must not be empty.',
              };
              anyError = true;
            }

            if (!anyError) decryptMessage(encryptedText, decryptionkey);
            else setErrors(newErrors);
          }}
          >
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
      {tab === 2 && (
        <>
          <Typography className="title general-padding" variant="h5" component="h5">
            <Link href="https://github.com/rmarks6767/s-des" onClick={(event) => event.preventDefault()}>
              View this on GitHub
            </Link>
          </Typography>
          <iframe
            title="github-code"
            frameBorder={0}
            width="100%"
            height="500px"
            srcDoc='<html><body><script src="https://gist.github.com/rmarks6767/0d620759e731b21903ae949ebe10fbc4.js"></script></body></html>'
          />
        </>
      )}
      <div hidden={tab !== 2} id="script-home" />
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
              <b>{ptAsBinary}</b>
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
          <div style={{ padding: '20px' }}>
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
        </div>
      )}

    </div>
  );
};

export default App;
