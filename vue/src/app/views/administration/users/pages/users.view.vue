<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import moment from 'moment'

import { PaginationDto, PaginationMeta, PaginationOptions } from '@/library/apis/localhost/dto/pagination.dto'
import { UserDto } from '@/library/apis/localhost/dto/user.dto'
import { UserAdminController } from '@/app/views/administration/users/controllers/user-admin.controller'
import { defaultOptions, tableColumns, sort, badges } from '../schema/users.schema'
import { parseQuery } from '@/library/utils/parse-query.util'

import TablePaginatedComponent from '@/app/components/table/paginated.component.vue'
import ContentLayout from '@/app/layouts/admin/components/admin-layout.component.vue'

const $route = useRoute()

const { t } = useI18n()
const { getUsersPaginated, updateUser, deleteUser } = UserAdminController

const loading = ref<boolean>(true)
const options = computed<PaginationOptions>(() => parseQuery<PaginationOptions>($route.query, defaultOptions))

const response = reactive<{ data: Array<UserDto>; meta: PaginationMeta }>({
  data: [],
  meta: new PaginationMeta({ pageOptions: options.value, itemCount: 0 })
})

async function getPaginatedData(payload: PaginationOptions): Promise<void> {
  loading.value = true

  await getUsersPaginated(payload)
    .then((res: PaginationDto<UserDto>) => {
      response.data = res.data
      response.meta = res.meta
    })
    .finally(() => (loading.value = false))
}

await getPaginatedData(options.value)

watch(
  () => $route.query,
  async (newQuery: LocationQuery): Promise<void> => {
    const parsed = parseQuery<PaginationOptions>(newQuery, defaultOptions)
    await getPaginatedData(parsed)
  }
)
</script>

<template>
  <ContentLayout title="administration.users.title" subtitle="administration.users.subtitle">
    <template #table>
      <TablePaginatedComponent
        v-model:options="options"
        :loading
        :columns="tableColumns"
        :rows="response.data"
        :pages="response.meta?.pageCount"
        :sort-options="sort"
        :caption="t('administration.users.caption', { showing: response.data.length }, response.meta.itemCount)"
      >
        <template v-slot>
          <div class="d-flex gap-2">
            <button class="btn btn-dark btn-icon" disabled type="button">
              <font-awesome-icon size="lg" :icon="['fas', 'ellipsis-vertical']" />
            </button>
          </div>
        </template>
        <template #user="{ row }">
          <div class="d-flex align-items-center gap-2">
            <img class="avatar-icon rounded-circle" :src="row.profile.avatar" />

            <div class="d-flex flex-column flex-grow-1">
              <p class="text-light fw-semibold">
                {{ row.getFullName() }}
              </p>
              <small class="text-muted">{{ row.email }}</small>
            </div>
          </div>
        </template>

        <template #created="{ row }">
          <small class="fw-semibold text-muted">{{ moment(row.createdAt).format('LL') }}</small>
        </template>

        <template #role="{ row }">
          <div class="d-flex align-items-center">
            <small class="fw-semibold text-truncate text-primary">
              {{ $t(badges[row.role].label).toUpperCase() }}
            </small>
          </div>
        </template>

        <template #actions="{ row }">
          <div class="d-flex gap-1 flex-nowrap">
            <button
              v-tooltip="{ text: $t('actions.update'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => updateUser(row, (_: UserDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-warning">
                <font-awesome-icon size="sm" :icon="['fas', 'pencil']" />
              </div>
            </button>
            <button
              v-tooltip="{ text: $t('actions.delete'), position: 'bottom', trigger: 'hover' }"
              class="btn btn-dark btn-icon-sm px-0"
              type="button"
              @click="(_: MouseEvent) => deleteUser(row, (_: UserDto) => { getPaginatedData(options) })"
            >
              <div class="d-flex flex-column align-items-center text-danger">
                <font-awesome-icon size="sm" :icon="['fas', 'trash-can']" />
              </div>
            </button>
          </div>
        </template>
      </TablePaginatedComponent>
    </template>
  </ContentLayout>
</template>
