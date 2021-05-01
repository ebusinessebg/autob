/* eslint-disable jsx-a11y/accessible-emoji */
import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import dayjs from 'dayjs';
import React from 'react';

import { ensureIST } from '../../../lib/browserUtils';
import { EXIT_STRATEGIES_DETAILS, INSTRUMENT_DETAILS } from '../../../lib/constants';

const TradeSetupForm = ({ enabledInstruments, state, onChange, onSubmit, exitStrategies }) => {
  const isSchedulingDisabled =
    dayjs().get('hours') > 15 || (dayjs().get('hours') === 15 && dayjs().get('minutes') > 30);

  return (
    <form noValidate>
      <Paper style={{ padding: 16 }}>
        <h3>Setup new trade</h3>
        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Instruments</FormLabel>
              <FormGroup row>
                {enabledInstruments.map((instrument) => (
                  <FormControlLabel
                    key={instrument}
                    label={INSTRUMENT_DETAILS[instrument].displayName}
                    control={
                      <Checkbox
                        name="instruments"
                        checked={state.instruments[instrument]}
                        onChange={() => {
                          onChange({
                            instruments: {
                              [instrument]: !state.instruments[instrument]
                            }
                          });
                        }}
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="lots"
              value={state.lots}
              onChange={(e) => onChange({ lots: e.target.value || '' })}
              label="Initial lots"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="martingaleIncrementSize"
              value={state.martingaleIncrementSize}
              onChange={(e) => onChange({ martingaleIncrementSize: e.target.value || '' })}
              label="⚡️ Martingale additional lots"
            />
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 16 }}>
            <TextField
              fullWidth
              name="maxTrades"
              value={state.maxTrades}
              onChange={(e) => onChange({ maxTrades: e.target.value || '' })}
              label="⚡️ Maximum trades to take"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Exit Strategy</FormLabel>
              <RadioGroup
                aria-label="exitStrategy"
                name="exitStrategy"
                value={state.exitStrategy}
                onChange={(e) => onChange({ exitStrategy: e.target.value })}>
                {exitStrategies.map((exitStrategy) => (
                  <FormControlLabel
                    key={exitStrategy}
                    value={exitStrategy}
                    control={<Radio />}
                    label={
                      <Typography style={{ fontSize: '14px' }}>
                        {EXIT_STRATEGIES_DETAILS[exitStrategy].label}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 16 }}>
            <TextField
              fullWidth
              name="slmPercent"
              value={state.slmPercent}
              onChange={(e) => onChange({ slmPercent: e.target.value || '' })}
              label="SLM %"
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormGroup column>
                <FormControlLabel
                  key={'autoSquareOff'}
                  label={'Auto Square off'}
                  control={
                    <Checkbox
                      checked={state.isAutoSquareOffEnabled}
                      onChange={() =>
                        onChange({
                          isAutoSquareOffEnabled: !state.isAutoSquareOffEnabled
                        })
                      }
                    />
                  }
                />
                {state.isAutoSquareOffEnabled ? (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Square off time"
                      value={state.squareOffTime}
                      onChange={(selectedDate) => {
                        onChange({ squareOffTime: ensureIST(selectedDate) });
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change square off time'
                      }}
                    />
                  </MuiPickersUtilsProvider>
                ) : null}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={(e) => {
                onChange({ runNow: true });
              }}>
              Execute now
            </Button>
          </Grid>

          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Schedule run"
                value={isSchedulingDisabled ? null : state.runAt}
                disabled={isSchedulingDisabled}
                onChange={(selectedDate) => {
                  onChange({ runAt: ensureIST(selectedDate) });
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change time'
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={() => onSubmit()}
              disabled={isSchedulingDisabled}>
              {isSchedulingDisabled
                ? `Schedule run`
                : `Schedule for ${dayjs(state.runAt).format('hh:mma')}`}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              <Box fontStyle="italic" fontSize={14}>
                <p>Note —</p>
                <ol>
                  <li>
                    ⚡️ Martingale additional lots — if SL gets hit, the next trade gets taken with
                    new lot size = last lot size + martingale additional lots. Set it to 0 if you
                    wish to deactivate the martingale method.
                  </li>
                  <li>
                    ⚡️ Maximum trades to take — it's recommended to not take more than 3 trades a
                    day. Set it to 0 if you wish to take only 1 trade a day.
                  </li>
                  <li>You can delete the task until scheduled time on the next step.</li>
                </ol>
              </Box>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </form>
  );
};
export default TradeSetupForm;