import Cookies from 'js-cookie';
import { push } from 'react-router-redux';

import { store } from '~/store';
import { APP_ROOT, LOGIN_ROOT } from './constants';
import { clientId } from './secrets';
import { SET_TOKEN } from './actions/authentication';
import { getStorage } from '~/storage';


export function initializeAuthentication(dispatch) {
  const token = getStorage('authentication/oauth-token') || null;
  const scopes = getStorage('authentication/scopes') || null;
  dispatch({ type: SET_TOKEN, token, scopes });
}

export function redirect(location) {
  window.location = location;
}

export function loginAuthorizePath(returnTo) {
  /* eslint-disable prefer-template */
  return `${LOGIN_ROOT}/oauth/authorize?` +
         `client_id=${clientId}` +
         '&scopes=*';
         //`&redirect_uri=${encodeURIComponent(APP_ROOT)}/oauth/callback?return=${returnTo}`;
  /* eslint-enable prefer-template */
}

export function setSession(oauthToken = '', scopes = '') {
  return (dispatch) => {
    // Set these two so we can grab them on subsequent page loads
    setStorage('authentication/oauth-token', oauthToken);
    setStorage('authentication/scopes', scopes);
    // Add all to state for this (page load) session
    dispatch(setToken(oauthToken, scopes));
  };
}

export async function checkLogin(props) {
  const { dispatch, location } = props;
  const { error, code } = location.query;
  const returnTo = location.query['return'];

  if (error) {
    this.setState({ error: location.query.error_description });
    return;
  }

  // if (!code) {
  //   return dispatch(push('/'));
  // }
  //

  // try {
  //   const json = JSON.parse(Cookies.get('__loa'));
  //   this.setSession(json.access_token, json.scopes, username, email, timezone);
  //   await dispatch(account.one());
  //
  // } catch(e) {
  //   console.error('Failed to parse oa cookie');
  //   return dispatch(push('/'));
  // }

  // TODO: update this logic
  const state = store.getState();
  if (next.location.pathname !== '/oauth/callback'
      && state.authentication.token === null) {
    const query = Object.keys(next.location.query || {})
            .reduce((a, k) => [
              ...a,
              `${k}=${encodeURIComponent(next.location.query[k])}`,
            ], []).join('%26');

    console.log('the cookie', document.cookie);

    // During testing we'll need to be able to replace this.
    const { redirect } = module.exports;
    const redirectTo = loginAuthorizePath(
      encodeURIComponent(`${next.location.pathname}${query ? `%3F${query}` : ''}`));
    redirect(redirectTo);
    return redirectTo;
  }
  return null;
}
