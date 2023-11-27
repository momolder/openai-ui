import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { ClientPrincipal } from '$lib/models/Contracts';
import { env } from '$env/dynamic/private';

export function GET({ request }: RequestEvent): Response {
  const principalString = request.headers.get('X-MS-CLIENT-PRINCIPAL');

  if (principalString) {
    const token = JSON.parse(atob(principalString)) as ClientPrincipal;
    if (env.App_ClaimName && env.App_ClaimValue) {
      if (token.claims.find((c) => c.typ === env.App_ClaimName && c.val.match(`${env.App_ClaimValue}`))) {
        return json(token, { status: 200 });
      } else {
        return json(token, { status: 401 });
      }
    }
  }
  // return json({ "auth_typ": "aad", "claims": [ { "typ": "aud", "val": "b053bc3d-49ac-4ee0-a781-de0cbbdf3908" }, { "typ": "iss", "val": "https://login.microsoftonline.com/a05cb8ff-1645-49b7-b010-4be15ff76b05/v2.0" }, { "typ": "iat", "val": "1700808670" }, { "typ": "nbf", "val": "1700808670" }, { "typ": "exp", "val": "1700812570" }, { "typ": "aio", "val": "AbQAS/8VAAAAhnSuKgZEVLgWOyNxbs8DdVi7hHCIrTwZcw8VYaPxN6zuu/hIR0lisQE2NWMxk9FTFptWiLfz2E60SOtj/FjAuDIrIL9FPWovN0CZd850TcePrMb25YXF4FDTQIrYiA6diTkdhrlNJL9lsGNRmCUavb/UkVFoc6DzU/+6vCGOUMNhBjKMzVJDS0TRs09wow4MUHY0Hjtv5tKELBW0JdWrl1RpcSW9BkGcpsWNHF7+SSE=" }, { "typ": "c_hash", "val": "AMUEDrz9krM0N8QY0_1_6A" }, { "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "val": "&#109;&#x6f;&#114;&#x69;&#116;&#122;&#46;&#110;&#101;&#117;&#x40;&#97;&#x64;&#101;&#115;&#115;&#111;&#46;&#100;&#x65;" }, { "typ": "http://schemas.microsoft.com/identity/claims/identityprovider", "val": "https://sts.windows.net/3d355765-67d9-47cd-9c7a-bf31179f56eb/" }, { "typ": "name", "val": "&#109;&#111;&#x72;&#105;&#x74;&#122;&#x2e;&#110;&#x65;&#x75;&#x40;&#x61;&#x64;&#x65;&#115;&#115;&#111;&#x2e;&#100;&#x65; Neu" }, { "typ": "nonce", "val": "64b9743dfda6407caeb47d2ba239e2ca_20231124070108" }, { "typ": "http://schemas.microsoft.com/identity/claims/objectidentifier", "val": "ff4db794-abde-489f-82d9-605b369a548f" }, { "typ": "preferred_username", "val": "&#109;&#x6f;&#114;&#x69;&#x74;&#122;&#46;&#110;&#101;&#x75;&#64;&#97;&#x64;&#x65;&#115;&#115;&#111;&#x2e;&#100;&#x65;" }, { "typ": "rh", "val": "0.AXMA_7hcoEUWt0mwEEvhX_drBT28U7CsSeBOp4HeDLvfOQgMAPw." }, { "typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "val": "aNgJqP-ljgX2vuRTS_31vIbIlfyei2ndh_Dkwk_PVAg" }, { "typ": "http://schemas.microsoft.com/identity/claims/tenantid", "val": "a05cb8ff-1645-49b7-b010-4be15ff76b05" }, { "typ": "uti", "val": "WJ0XPkJQkEOLXeBszBtwAQ" }, { "typ": "ver", "val": "2.0" } ], "name_typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", "role_typ": "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" }, { status: 200 });
  return json({}, { status: 200 });
}
