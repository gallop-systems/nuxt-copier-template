# Changelog

## [1.15.0](https://github.com/gallop-systems/nuxt-copier-template/compare/v1.14.0...v1.15.0) (2026-06-22)


### Features

* add a 2-week release-age cooldown to the descendant Renovate config ([c19e997](https://github.com/gallop-systems/nuxt-copier-template/commit/c19e997d9145282ba7e89e02c93f06a0065f9a99))
* ship Renovate config into scaffolded repos ([ba99cad](https://github.com/gallop-systems/nuxt-copier-template/commit/ba99cad0bcbaec9116465693ea2749693fe1245c))
* ship Renovate into scaffolded repos (descendants own their own deps) ([a1ee968](https://github.com/gallop-systems/nuxt-copier-template/commit/a1ee968886a40b5d407d1979b6b0f98d5c9e30df))


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
