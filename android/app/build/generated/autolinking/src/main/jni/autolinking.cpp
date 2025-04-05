/**
 * This code was generated by [React Native](https://www.npmjs.com/package/@react-native/gradle-plugin).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 */

#include "autolinking.h"
#include <rnasyncstorage.h>
#include <rngesturehandler_codegen.h>
#include <react/renderer/components/rngesturehandler_codegen/ComponentDescriptors.h>
#include <safeareacontext.h>
#include <react/renderer/components/safeareacontext/ComponentDescriptors.h>
#include <rnscreens.h>
#include <react/renderer/components/rnscreens/ComponentDescriptors.h>

namespace facebook {
namespace react {

std::shared_ptr<TurboModule> autolinking_ModuleProvider(const std::string moduleName, const JavaTurboModule::InitParams &params) {
auto module_rnasyncstorage = rnasyncstorage_ModuleProvider(moduleName, params);
if (module_rnasyncstorage != nullptr) {
return module_rnasyncstorage;
}
auto module_rngesturehandler_codegen = rngesturehandler_codegen_ModuleProvider(moduleName, params);
if (module_rngesturehandler_codegen != nullptr) {
return module_rngesturehandler_codegen;
}
auto module_safeareacontext = safeareacontext_ModuleProvider(moduleName, params);
if (module_safeareacontext != nullptr) {
return module_safeareacontext;
}
auto module_rnscreens = rnscreens_ModuleProvider(moduleName, params);
if (module_rnscreens != nullptr) {
return module_rnscreens;
}
  return nullptr;
}

std::shared_ptr<TurboModule> autolinking_cxxModuleProvider(const std::string moduleName, const std::shared_ptr<CallInvoker>& jsInvoker) {

  return nullptr;
}

void autolinking_registerProviders(std::shared_ptr<ComponentDescriptorProviderRegistry const> providerRegistry) {
providerRegistry->add(concreteComponentDescriptorProvider<RNGestureHandlerButtonComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNGestureHandlerRootViewComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNCSafeAreaProviderComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNCSafeAreaViewComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSFullWindowOverlayComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenContainerComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenNavigationContainerComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderConfigComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackHeaderSubviewComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenStackComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSSearchBarComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenFooterComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSScreenContentWrapperComponentDescriptor>());
providerRegistry->add(concreteComponentDescriptorProvider<RNSModalScreenComponentDescriptor>());
  return;
}

} // namespace react
} // namespace facebook