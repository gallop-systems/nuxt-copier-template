# Changelog

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
