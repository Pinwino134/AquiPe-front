
import React from 'react';
import { NativeTabs } from 'expo-router/native-tabs';
import { Platform } from 'react-native';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#FFFFFF"
      tintColor="#146C67"
      labelVisibilityMode="labeled"
      labelStyle={{
        default: {
          color: '#526A67',
          fontSize: 11,
        },
        selected: {
          color: '#146C67',
          fontSize: 11,
          fontWeight: 'bold',
        },
      }}
    >
      {/* Inicio */}
      <NativeTabs.Trigger name="inicio">
        <NativeTabs.Trigger.Label>
          Inicio
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="house.fill"
          drawable="ic_menu_view"
        />
      </NativeTabs.Trigger>

      {/* Publicar */}
      <NativeTabs.Trigger name="publicar">
        <NativeTabs.Trigger.Label>
          Publicar
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="plus.square"
          drawable="ic_input_add"
        />
      </NativeTabs.Trigger>

      {/* Notificaciones */}
      <NativeTabs.Trigger name="notificaciones">
        <NativeTabs.Trigger.Label>
          Notificaciones
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="bell"
          drawable="ic_dialog_info"
        />
      </NativeTabs.Trigger>

      {/* Perfil */}
      <NativeTabs.Trigger name="perfil">
        <NativeTabs.Trigger.Label>
          Perfil
        </NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="person.crop.circle"
          drawable="ic_menu_myplaces"
        />
      </NativeTabs.Trigger>
       {/* Servicios: no aparece en el menú inferior */}
            <NativeTabs.Trigger name="servicios" hidden />
    </NativeTabs>
  );
}
