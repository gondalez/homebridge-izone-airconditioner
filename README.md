# homebridge-izone-airconditioner
A [homebridge](https://github.com/nfarina/homebridge) plugin that allows you to control your iZone air conditioner with Homekit and Siri.

Install the plugin:

    sudo npm -g install homebridge-izone-airconditioner

Add the following to config.json:

    {
      "accessory": "iZone Air Conditioner",
      "name": "Air Conditioner",
      "url": "http://<lan ip address of iZone controller>/",
      "reportSetpointAsCurrentTemperature": false
    }

Use `reportSetpointAsCurrentTemperature` if you see 0.0 as the current temperature. This happens when your iZone controller is letting the airconditioner manage the temperatures. Setting this option tells the plugin to show the last set temperature as the current temperature. If you would like an accurate measurement I suggest configuring your iZone controller to manage the temperature. Adding zone and return air sensors also helps with this.

## Limits

The controller is assumed to have a static lan IP address. I suggest doing this via your router's DHCP settings.

The detected temperature is based on the average of all active temperature sensors. This can vary depending on the control mode (AC unit, master sensor, or zone sensors) of your iZone system and whether you have temperature sensors installed for the zones.

It is not possible to set the mode to "Vent" or "Dry". This is a Homekit limitation.

When setting the mode to "Auto" and setting a temperature range, the maximum temperature is used. This is a limitation of the iZone controller which does not support ranges.

The fan speed is accessible via the cog icon for the accessory. The slider will snap into place for Low, Med, High settings. Setting the slider to max sets the fan to auto.
