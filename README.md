# homebridge-izone-airconditioner
A [homebridge](https://github.com/nfarina/homebridge) plugin that allows you to control your iZone air conditioner with Homekit and Siri.

Install the plugin:

    sudo npm -g install homebridge-izone-airconditioner

Add the following to config.json:

    {
      "accessory": "iZone Air Conditioner",
      "name": "Air Conditioner",
      "url": "http://<lan ip address of iZone controller>/"
    }

## Limits

The controller is assumed to have a static lan IP address. I suggest doing this via your router's DHCP settings.

The detected temperature is based on the "Supply" temperature, but the iZone controller I was using always returned 0.0. So Homekit will report 0.0 as the detected temperature.

It is not possible to set the mode to "Vent" or "Dry". This is a Homekit limitation.

When setting the mode to "Auto" and setting a temperature range, the maximum temperature is used. This is a limitation of the iZone controller which does not support ranges.

The fan speed is accessible via the cog icon for the accessory. The slider will snap into place for Low, Med, High settings. Setting the slider to max sets the fan to auto.
