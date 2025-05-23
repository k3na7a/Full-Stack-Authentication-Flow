<script setup lang="ts">
import { ref } from 'vue'
import { Form } from 'vee-validate'
import { useFormUtil } from '@/library/utils/forms.util'
import { ROUTE_NAMES } from '@/app/router/routes'
import TextInput from '@/app/components/inputs/text.input.vue'
import PasswordValidationList from '@/app/components/labels/password-validation-list.component.vue'
import ModalTitleComponent from '@/app/components/modal/modal-title.component.vue'
import { validationSchema, registrationValues } from '../../schema/registration-validation.schema'

const { getSubmitFn } = useFormUtil()

const loading = ref<boolean>(false)
const props = defineProps<{
  callback: (values: any) => Promise<void>
}>()

const onSubmit = getSubmitFn(validationSchema, async (values: registrationValues) => {
  loading.value = true
  props.callback(values).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <Form @submit="onSubmit" :validation-schema="validationSchema" v-slot="{ meta }">
    <div class="d-flex flex-column gap-3">
      <ModalTitleComponent :title="$t('authentication.register.modal-title')" />
      <div class="d-flex flex-column gap-1">
        <h6 class="fw-semibold">{{ $t('forms.name') }}</h6>
        <div class="row gy-3 align-items-start flex-grow-1">
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput autocomplete="given-name" name="firstname" type="text" />
            <small>{{ $t('forms.given-name') }}</small>
          </div>
          <div class="col-12 col-sm-6 d-flex flex-column gap-1">
            <TextInput autocomplete="family-name" name="lastname" type="text" />
            <small>{{ $t('forms.family-name') }}</small>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column">
        <div class="row gy-3">
          <div class="col-12">
            <TextInput autocomplete="email" name="email" type="email" label="forms.email" />
          </div>
          <div class="col-12 d-flex flex-column gap-1">
            <TextInput autocomplete="new-password" name="password" type="password" label="forms.password" />
            <PasswordValidationList />
          </div>
        </div>
      </div>

      <div class="d-flex flex-column text-muted">
        <i18n-t keypath="legal.term" tag="p" scope="global">
          <RouterLink
            target="_blank"
            :to="{ name: ROUTE_NAMES.HOME }"
            class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          >
            {{ $t('legal.terms-of-service') }}
          </RouterLink>
          <RouterLink
            target="_blank"
            :to="{ name: ROUTE_NAMES.HOME }"
            class="link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          >
            {{ $t('legal.privacy-notice') }}
          </RouterLink>
        </i18n-t>
      </div>

      <div class="d-grid">
        <button :disabled="!meta.valid || loading || !meta.dirty" class="btn btn-primary px-0" type="submit">
          <div v-if="!loading" class="containter">{{ $t('actions.sign-up') }}</div>
          <div v-else class="containter">
            {{ $t('actions.loading') }}
          </div>
        </button>
      </div>
    </div>
  </Form>
</template>
