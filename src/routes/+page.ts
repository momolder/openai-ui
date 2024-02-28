/* eslint-disable @typescript-eslint/no-throw-literal */
import stateService from '$lib/services/state-service';
import { error } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';
import { env } from '$env/dynamic/public';
import { t } from '$lib/localization/translator';
import { lang } from '$lib/localization/translation';

export async function load({ fetch }: PageLoadEvent) {
  if (!(await stateService.validateUser(fetch))) throw error(401, t(lang.Errors.Unauthorized));
  if (env.PUBLIC_OpenAi_Deployments.length === 0) throw error(412, t(lang.Errors.NoDeployment));
}
