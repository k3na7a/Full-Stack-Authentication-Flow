<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useAuthStore, AuthStore } from '@/app/store/authentication.store'
import { Role } from '@/library/apis/localhost/dto/user.dto'

import ErrorBoundary from '@/app/components/error-boundary/error-boundary.v1.component.vue'
import UnauthorizedComponent from '@/app/components/unauthorized.layout.vue'

const authStore: AuthStore = useAuthStore()
const isAuthenticated: ComputedRef<boolean> = computed(() => authStore.authenticatedUser?.role === Role.ADMIN)
</script>

<template>
  <template v-if="!isAuthenticated">
    <UnauthorizedComponent title="authentication.not-authorized" />
  </template>
  <template v-else>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <ErrorBoundary>
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              {{ $t('actions.loading') }}
            </template>
          </Suspense>
          <template #error>
            {{ $t('forms.error-general') }}
          </template>
        </ErrorBoundary>
      </template>
    </RouterView>
  </template>
</template>
