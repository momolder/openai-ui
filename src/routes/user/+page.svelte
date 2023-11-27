<script lang="ts">
  import { UserStore } from '$lib/services/state-management';
  import stateService from '$lib/services/state-service';
</script>

<div>
  {#await stateService.getUserinfo() then userInfo}
    <h2>{$UserStore.displayName}</h2>
    {#if userInfo}
      <p>auth_typ: {userInfo.auth_typ}</p>
      <p>name_typ: {userInfo.name_typ}</p>
      <p>role_typ: {userInfo.role_typ}</p>
      <p>claims</p>
      {#if userInfo.claims}
        {#each userInfo.claims as { typ, val }}
          <p>{typ}: {val}</p>
        {/each}
      {:else}
        <p>no claims in token</p>
      {/if}
    {/if}
  {/await}
</div>
