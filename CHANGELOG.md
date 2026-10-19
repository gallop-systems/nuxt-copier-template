# Changelog

## [2.0.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.33.1...v2.0.0) (2026-10-19)


### ⚠ BREAKING CHANGES

* **template:** the template no longer ships PrimeVue or Volt (dropped in 1.33.0, which should have been a major) and now builds on the gallop-ui layer. Existing apps keep one Toaster and one ConfirmDialog when merging this app.vue.

### Features

* **template:** mount gallop-ui's Toaster and ConfirmDialog once in app.vue ([#133](https://github.com/gallop-systems/nuxt-copier-template/issues/133)) ([9827e55](https://github.com/gallop-systems/nuxt-copier-template/commit/9827e557562c08fe6c8d9b90846d3e45cae309ae))
* **template:** yarn ui:probe, gallop-ui's hunt for UI bugs screenshots miss ([#132](https://github.com/gallop-systems/nuxt-copier-template/issues/132)) ([f611788](https://github.com/gallop-systems/nuxt-copier-template/commit/f6117883a3802e88394601a6f80a31ec054429a0))

## [1.33.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.33.0...v1.33.1) (2026-10-19)


### Bug Fixes

* **template:** ignore .agents/skills, and don't suggest stash before a layer pull ([#131](https://github.com/gallop-systems/nuxt-copier-template/issues/131)) ([1d3ee23](https://github.com/gallop-systems/nuxt-copier-template/commit/1d3ee231f4e3e5f1283a926643f6090a64c4c4e1))
* **template:** ignore auto-animate's post-teardown requestAnimationFrame error in frontend tests ([#129](https://github.com/gallop-systems/nuxt-copier-template/issues/129)) ([4cf721f](https://github.com/gallop-systems/nuxt-copier-template/commit/4cf721f02133deccf7b38f77b261619358f0e62e))

## [1.33.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.32.0...v1.33.0) (2026-10-18)


### Features

* **template:** drop PrimeVue and Volt ([#128](https://github.com/gallop-systems/nuxt-copier-template/issues/128)) ([dec5df0](https://github.com/gallop-systems/nuxt-copier-template/commit/dec5df03a19966227ce04eeb8f37a15575df18ea))


### Bug Fixes

* **template:** give nuxt-env frontend test setup 30s under pre-push load ([#126](https://github.com/gallop-systems/nuxt-copier-template/issues/126)) ([32b7320](https://github.com/gallop-systems/nuxt-copier-template/commit/32b7320fb85f04319e15a28887d2fad04cd83265))

## [1.32.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.31.0...v1.32.0) (2026-10-18)


### Features

* **template:** yarn ui:tokens, and the test database's real name in global setup ([#123](https://github.com/gallop-systems/nuxt-copier-template/issues/123)) ([4ce2bde](https://github.com/gallop-systems/nuxt-copier-template/commit/4ce2bde8fb2ae8e00def776a0261ab868e1003f6))

## [1.31.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.30.0...v1.31.0) (2026-10-18)


### Features

* **template:** declare @vueuse/router for URL-synced state (useRouteQuery) ([#118](https://github.com/gallop-systems/nuxt-copier-template/issues/118)) ([4dedc00](https://github.com/gallop-systems/nuxt-copier-template/commit/4dedc001e6c12bcbc93b2f197e995a439311ec5b))
* **template:** declare pluralize for gallop-ui's noun helper ([#121](https://github.com/gallop-systems/nuxt-copier-template/issues/121)) ([f71cb3d](https://github.com/gallop-systems/nuxt-copier-template/commit/f71cb3d55b8d8e73608c126b73b45b58d031202a))
* **template:** yarn ui:impact, gallop-ui's cross-app impact preview ([#119](https://github.com/gallop-systems/nuxt-copier-template/issues/119)) ([1a01b23](https://github.com/gallop-systems/nuxt-copier-template/commit/1a01b23943b949292b25c04091f3e9dbe5edda1d))
* **template:** yarn ui:migrate forwards to the layer's migration kit ([#122](https://github.com/gallop-systems/nuxt-copier-template/issues/122)) ([b0b1e52](https://github.com/gallop-systems/nuxt-copier-template/commit/b0b1e52bb6c75083d98ef2c49bf5a861860437b2))

## [1.30.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.29.0...v1.30.0) (2026-10-16)


### Features

* **template:** ask for the app's time zone; drop useFormatters for gallop-ui's formatters ([#116](https://github.com/gallop-systems/nuxt-copier-template/issues/116)) ([20f1146](https://github.com/gallop-systems/nuxt-copier-template/commit/20f11462175c3abc6e11ee7445fed4218757cc41))

## [1.29.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.28.0...v1.29.0) (2026-10-16)


### Features

* **template:** declare @tanstack/vue-table for gallop-ui's DataTable ([#114](https://github.com/gallop-systems/nuxt-copier-template/issues/114)) ([86cb04a](https://github.com/gallop-systems/nuxt-copier-template/commit/86cb04a4b70ef7c9624d88ce2e69788429d5d142))

## [1.28.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.27.0...v1.28.0) (2026-10-16)


### Features

* **template:** declare @internationalized/date for gallop-ui's Calendar and InputDate ([#112](https://github.com/gallop-systems/nuxt-copier-template/issues/112)) ([042b8ae](https://github.com/gallop-systems/nuxt-copier-template/commit/042b8aeb61c49cd0282d9825bc6d1ddd41ede6f9))

## [1.27.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.26.0...v1.27.0) (2026-10-16)


### Features

* **template:** handle token for gallop-ui's Switch ([#110](https://github.com/gallop-systems/nuxt-copier-template/issues/110)) ([0a51cf0](https://github.com/gallop-systems/nuxt-copier-template/commit/0a51cf074aad0b27a880ce1fef7a7969b91a02e2))

## [1.26.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.25.0...v1.26.0) (2026-10-16)


### Features

* **template:** highlight tokens for gallop-ui's Select ([#108](https://github.com/gallop-systems/nuxt-copier-template/issues/108)) ([36c57d1](https://github.com/gallop-systems/nuxt-copier-template/commit/36c57d1c7512d71643cfb03dadea8238bd96657e))
* **template:** panel tokens for gallop-ui's Modal ([#107](https://github.com/gallop-systems/nuxt-copier-template/issues/107)) ([180c8b5](https://github.com/gallop-systems/nuxt-copier-template/commit/180c8b5650bee4c40374792ae6315b3d308b022e))

## [1.25.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.24.0...v1.25.0) (2026-10-15)


### Features

* **template:** form-control tokens for gallop-ui's Input and Textarea ([#105](https://github.com/gallop-systems/nuxt-copier-template/issues/105)) ([9ac0f6a](https://github.com/gallop-systems/nuxt-copier-template/commit/9ac0f6a487833b836368aa10980c3ea90e93b1b0))

## [1.24.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.23.1...v1.24.0) (2026-10-15)


### Features

* **template:** interaction tokens for gallop-ui's Button ([#103](https://github.com/gallop-systems/nuxt-copier-template/issues/103)) ([78b737f](https://github.com/gallop-systems/nuxt-copier-template/commit/78b737f1df19bec86e594635a287a40c960d4f78))

## [1.23.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.23.0...v1.23.1) (2026-10-15)


### Bug Fixes

* **template:** require Nuxt 4.5 ([#101](https://github.com/gallop-systems/nuxt-copier-template/issues/101)) ([6de2713](https://github.com/gallop-systems/nuxt-copier-template/commit/6de27134fbf5444420bab03dc7d0a74a93876a01))

## [1.23.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.22.4...v1.23.0) (2026-10-15)


### Features

* **template:** gallop-ui shared UI layer support ([#99](https://github.com/gallop-systems/nuxt-copier-template/issues/99)) ([dc1749d](https://github.com/gallop-systems/nuxt-copier-template/commit/dc1749df125d075610cc20fe8d3b5a9d50c961af))

## [1.22.4](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.22.3...v1.22.4) (2026-10-15)


### Bug Fixes

* **template:** accept typed dates in VoltDatePicker on Tab/Enter (GAL-1174) ([#97](https://github.com/gallop-systems/nuxt-copier-template/issues/97)) ([6d1ee18](https://github.com/gallop-systems/nuxt-copier-template/commit/6d1ee188bcb54abad964407e0fc53735f1f0d713))

## [1.22.3](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.22.2...v1.22.3) (2026-10-01)


### Bug Fixes

* **renovate:** let agent-skills bumps open immediately, floor raised each release (GAL-1161) ([#93](https://github.com/gallop-systems/nuxt-copier-template/issues/93)) ([1ccdcde](https://github.com/gallop-systems/nuxt-copier-template/commit/1ccdcdea15320f8f5e377d5b2ff6485d7ede4f23))
* **yarn:** preapprove @gallopsystems/* past the 2w npm age gate (GAL-1162) ([#92](https://github.com/gallop-systems/nuxt-copier-template/issues/92)) ([4c4d9e6](https://github.com/gallop-systems/nuxt-copier-template/commit/4c4d9e67e827d44a627ff0f7fd0809ff3d277c74))

## [1.22.2](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.22.1...v1.22.2) (2026-09-03)


### Bug Fixes

* **template:** remove the redundant Microsoft OAuth state wrapper ([#87](https://github.com/gallop-systems/nuxt-copier-template/issues/87)) ([6cacfe2](https://github.com/gallop-systems/nuxt-copier-template/commit/6cacfe220319ce0e4f39ed95680d868ace93fe0d))
* **template:** restrict Renovate to weekend PRs (GAL-1004) ([#83](https://github.com/gallop-systems/nuxt-copier-template/issues/83)) ([330b728](https://github.com/gallop-systems/nuxt-copier-template/commit/330b7281ec7198b3274e061b4f3f41e38a0d50ec))

## [1.22.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.22.0...v1.22.1) (2026-07-31)


### Bug Fixes

* **template:** disable PrimeVue majors and unblock lockfile maintenance ([#81](https://github.com/gallop-systems/nuxt-copier-template/issues/81)) ([5b85164](https://github.com/gallop-systems/nuxt-copier-template/commit/5b851647258015482a3192e2f7e2f77b916c2478))

## [1.22.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.21.1...v1.22.0) (2026-07-27)


### Features

* **template:** enforce 2-week minimum package age at the yarn level ([#78](https://github.com/gallop-systems/nuxt-copier-template/issues/78)) ([f512326](https://github.com/gallop-systems/nuxt-copier-template/commit/f512326d7f89d30496284c668f8fcf7071dd9638))

## [1.21.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.21.0...v1.21.1) (2026-07-20)


### Bug Fixes

* **template:** typecheck server code via project references ([#76](https://github.com/gallop-systems/nuxt-copier-template/issues/76)) ([2ee04cd](https://github.com/gallop-systems/nuxt-copier-template/commit/2ee04cd093d8265af14918dd100ee426e98a4c69))

## [1.21.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.20.0...v1.21.0) (2026-07-16)


### Features

* **template:** surface DB schema comments in generated types ([#74](https://github.com/gallop-systems/nuxt-copier-template/issues/74)) ([e247e09](https://github.com/gallop-systems/nuxt-copier-template/commit/e247e09d873f1003ae6c425b0c6ea319938ed331))

## [1.20.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.19.0...v1.20.0) (2026-07-02)


### Miscellaneous

* release template 1.20.0 ([#66](https://github.com/gallop-systems/nuxt-copier-template/issues/66)) ([0fb2c42](https://github.com/gallop-systems/nuxt-copier-template/commit/0fb2c42ccb3aa13d3cd9d95cf1fd81282cbf8b46))

## [1.19.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.18.2...v1.19.0) (2026-07-01)


### Features

* **renovate:** auto-merge prod minor/patch updates, not just devDeps ([#63](https://github.com/gallop-systems/nuxt-copier-template/issues/63)) ([90203b4](https://github.com/gallop-systems/nuxt-copier-template/commit/90203b4508eb55b11220826dbef3c21c8b836890))

## [1.18.2](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.18.1...v1.18.2) (2026-07-01)


### Bug Fixes

* **template:** rebase Renovate PRs when base branch advances ([c2c5f36](https://github.com/gallop-systems/nuxt-copier-template/commit/c2c5f3667823110cf58eccfd2c7d7d401ca0231a))
* **template:** rebase Renovate PRs when base branch advances ([3368765](https://github.com/gallop-systems/nuxt-copier-template/commit/3368765ba8f31f644127a4dc76f860f107b0a633))

## [1.18.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.18.0...v1.18.1) (2026-06-30)


### Continuous Integration

* **template:** render-check the build job (not just boot) ([cb5bcf3](https://github.com/gallop-systems/nuxt-copier-template/commit/cb5bcf3a7abf0c1bd4afe7fc9ba75ca0df12f440))
* **template:** render-check the build, not just boot ([0ca2ea2](https://github.com/gallop-systems/nuxt-copier-template/commit/0ca2ea239a187f4730b6d8fc173d153906264ea4))
* **template:** group PrimeVue/PrimeUIX Renovate bumps to prevent dual-version prod breaks ([22c0f26](https://github.com/gallop-systems/nuxt-copier-template/commit/22c0f26856317eb4b3519c7c2d6303e6303ecfd6))

## [1.18.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.17.1...v1.18.0) (2026-06-30)


### Features

* **template:** add ci_runner toggle for self-hosted runners ([25e3295](https://github.com/gallop-systems/nuxt-copier-template/commit/25e32951555de088fbdbf96af42977b7b2d932e6))
* **template:** de-shard CI, container-mode test job, faster build ([4f729da](https://github.com/gallop-systems/nuxt-copier-template/commit/4f729daa9c96a10b0ec0e78bc354970775a84ad5))
* **template:** drop self-hosted runner option, keep CI improvements ([fa2e051](https://github.com/gallop-systems/nuxt-copier-template/commit/fa2e05180192d104368a6f0df8703afad418d2ca))
* **template:** leaner GitHub-hosted CI (de-shard, container test, SSL fix) ([5de423e](https://github.com/gallop-systems/nuxt-copier-template/commit/5de423ea09ccca7de8179f12668bf61db79c37af))

## [1.17.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.17.0...v1.17.1) (2026-06-29)


### Bug Fixes

* **template:** exclude .claude/worktrees from dev file-watchers ([b86e83d](https://github.com/gallop-systems/nuxt-copier-template/commit/b86e83d4f29b7680b33d62219d7515f191af8be1))
* **template:** exclude .claude/worktrees from dev file-watchers ([f4cc05a](https://github.com/gallop-systems/nuxt-copier-template/commit/f4cc05a82ec5238b68cc93e3f89d20d025ffb8cd))

## [1.17.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.16.2...v1.17.0) (2026-06-29)


### Features

* **template:** add AutoAnimate and migrate icons to Lucide ([7d2b025](https://github.com/gallop-systems/nuxt-copier-template/commit/7d2b025a13f707495c4995c38982c653c29c01ea))
* **template:** add AutoAnimate and migrate icons to Lucide ([2f15237](https://github.com/gallop-systems/nuxt-copier-template/commit/2f152379d010adfe94bb5bcc8f97d91eff09b735))

## [1.16.2](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.16.1...v1.16.2) (2026-06-24)


### Code Refactoring

* **template:** replace raw sql lower(email) with typed eb.fn ([36b2ff7](https://github.com/gallop-systems/nuxt-copier-template/commit/36b2ff7e8db5f4239589b4beef5e50864eb703e9))
* **template:** replace raw sql lower(email) with typed eb.fn ([329ac4d](https://github.com/gallop-systems/nuxt-copier-template/commit/329ac4d30dc9ad6c7f970c87f477b2c88aada84f))

## [1.16.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.16.0...v1.16.1) (2026-06-23)


### Continuous Integration

* trim scaffolded CI to cut Actions minutes ([a119b00](https://github.com/gallop-systems/nuxt-copier-template/commit/a119b00ffbffd10abaa103132f648c8d01b81086))
* trim scaffolded CI to cut Actions minutes ([8c27b27](https://github.com/gallop-systems/nuxt-copier-template/commit/8c27b27d41d5c8c141b65ff444f6355ea1e9d224))

## [1.16.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.15.3...v1.16.0) (2026-06-22)


### Features

* make auth a provider choice (google/microsoft/none) ([638f618](https://github.com/gallop-systems/nuxt-copier-template/commit/638f618a626ad49f000571ec36286c4fba5fc3b6))
* make auth a provider choice (google/microsoft/none) ([fee65a4](https://github.com/gallop-systems/nuxt-copier-template/commit/fee65a4abf1155411a42a5a7579c323f0636fc8f))


### Continuous Integration

* keep engines.node and .nvmrc in lockstep via Renovate ([717deae](https://github.com/gallop-systems/nuxt-copier-template/commit/717deaeb7161bdde91f2979ebecb8b112d888234))

## [1.15.3](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.15.2...v1.15.3) (2026-06-22)


### Bug Fixes

* pin scaffold engines.node so DO deploys match .nvmrc ([054104e](https://github.com/gallop-systems/nuxt-copier-template/commit/054104e10635091a0da667115b2305b93ec408d0))
* pin scaffold engines.node so DO deploys match .nvmrc ([a6fdef0](https://github.com/gallop-systems/nuxt-copier-template/commit/a6fdef0c9aad0a51fbec6898f364c15c22217307))

## [1.15.2](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.15.1...v1.15.2) (2026-06-22)


### Bug Fixes

* import kysely migration symbols from kysely/migration (0.29) ([695533e](https://github.com/gallop-systems/nuxt-copier-template/commit/695533e81aaf0227e3b5e415b715a63db27e6a81))
* move kysely to 0.29 with its ecosystem; group kysely in Renovate ([f68eebc](https://github.com/gallop-systems/nuxt-copier-template/commit/f68eebcfc85e96c8e22f04e64cdc3ef786749dca))
* move kysely to 0.29 with its ecosystem; group kysely in Renovate ([ae6be1e](https://github.com/gallop-systems/nuxt-copier-template/commit/ae6be1e0fa8a26e516ed0ae5ab69dcd029a47704))

## [1.15.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.15.0...v1.15.1) (2026-06-22)


### Bug Fixes

* disable Renovate's copier manager in descendant config ([92465cc](https://github.com/gallop-systems/nuxt-copier-template/commit/92465cc109954ea811133849e0e514deb6942691))
* disable Renovate's copier manager in the descendant config ([0bdfb3a](https://github.com/gallop-systems/nuxt-copier-template/commit/0bdfb3a3fcd7255360703b687c7e6cd708d851d7))

## [1.15.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.14.1...v1.15.0) (2026-06-22)


### Features

* ship Renovate into descendant repos (own deps; agent-skills template-owned; 2-week cooldown) ([64066bd](https://github.com/gallop-systems/nuxt-copier-template/commit/64066bd17574bcd32bcd2da9a00c18e18608bb52))

## [1.14.1](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.14.0...v1.14.1) (2026-06-22)


### Bug Fixes

* declare typescript + vue-tsc in scaffold (nuxt typecheck drift) ([950efc4](https://github.com/gallop-systems/nuxt-copier-template/commit/950efc427c8fd94cdf6895db48e320b3f86f2551))
* declare typescript + vue-tsc in the scaffold so nuxt typecheck works ([4afe753](https://github.com/gallop-systems/nuxt-copier-template/commit/4afe753f3bf0224929e5a14018d2005a6b011d73))
* scaffolded .mcp.json and index.vue now pass oxfmt ([f8e1e8b](https://github.com/gallop-systems/nuxt-copier-template/commit/f8e1e8b9908ba75a36ad604288d8901956ecb50d))


### Continuous Integration

* also disable Yarn immutable installs for the scaffold ([e294cdf](https://github.com/gallop-systems/nuxt-copier-template/commit/e294cdf505a60ba6cded168b5e3808f05f3fe4c6))
* automate dependency bumps (Renovate) and releases (release-please) ([1580887](https://github.com/gallop-systems/nuxt-copier-template/commit/1580887e5af9601293328ef64698d8e678dc4652))
* meta-test that the scaffolded project builds, boots, and serves ([ed22f79](https://github.com/gallop-systems/nuxt-copier-template/commit/ed22f795798b926f7c13f8024d99fe1c651ba370))
* opt out of Yarn hardened mode in the meta-test ([5750d16](https://github.com/gallop-systems/nuxt-copier-template/commit/5750d161a8e1900c80d8692281df09ac0e436b34))
* template automation — Renovate + release-please + meta-test (build/boot/smoke) ([383ec10](https://github.com/gallop-systems/nuxt-copier-template/commit/383ec10b9331acc7616d50995e7d9018ba7ea7bd))
