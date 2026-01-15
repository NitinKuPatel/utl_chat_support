export const productCategories = [
    { id: "inverter", name: "Solar Inverter" },
    { id: "battery", name: "Solar Battery" },
    { id: "panel", name: "Solar Panel" },
    { id: "smu", name: "Solar Management Unit (SMU)" },
    { id: "ups", name: "Online/Offline UPS" },
];

export const productModels: Record<string, string[]> = {
    inverter: [
        "Gamma+ 1kVA/12V",
        "Gamma+ 1kVA/24V",
        "Gamma+ 2kVA/24V",
        "Gamma+ 3.5kVA/48V",
        "Gamma+ 5kVA/48V",
        "Heliac 1550/12V",
        "Heliac 2550/24V",
        "Shamsi 675VA/12V",
        "Shamsi 875VA/12V",
        "Alfa+ 1kVA",
        "Alfa+ 2kVA",
        "Mars Online PCU",
        "Star Online PCU",
    ],
    battery: [
        "UST 4036 (40Ah)",
        "UST 1536 (150Ah)",
        "UST 1560 (150Ah)",
        "UST 2036 (200Ah)",
        "USB 1760 (170Ah)",
        "Lithium-Ion 40Ah",
        "Lithium-Ion 100Ah",
    ],
    panel: [
        "Poly 40W",
        "Poly 165W",
        "Mono PERC 200W",
        "Mono PERC 390W",
        "Mono PERC 400W",
        "Mono PERC 540W",
    ],
    smu: [
        "SMU 10A/12V",
        "SMU 20A/12V",
        "SMU 40A/24V",
        "SMU 60A/48V",
    ],
    ups: [
        "Online UPS 1kVA",
        "Online UPS 2kVA",
        "Online UPS 3kVA",
        "Online UPS 5kVA",
        "Online UPS 10kVA",
    ]
};

export const commonIssues: Record<string, string[]> = {
    inverter: [
        "Error Code E05 (Overload)",
        "Error Code E07 (Over Voltage)",
        "Error Code E08 (EEPROM)",
        "Error Code E14 (Ground Fault)",
        "Not Turning On",
        "Display Not Working",
        "No Output Power",
        "Fan Noise / Vibration",
        "Grid Synchronization Fail",
    ],
    battery: [
        "Low Backup Time",
        "Not Charging",
        "Battery Swelling",
        "Terminal Corrosion",
        "Overheating",
        "Water Level Low (Tubular)",
        "Voltage Drop Under Load",
    ],
    panel: [
        "Low Power Generation",
        "Physical Damage / Crack",
        "Hotspot Heating",
        "Bypass Diode Failure",
        "Junction Box Issue",
    ],
    smu: [
        "Display Error",
        "Not Controlling Charge",
        "Reverse Current Flow",
    ],
    ups: [
        "Beeping continuously",
        "Not switching to Battery",
        "Output Voltage Fluctuations",
        "Battery Low Alarm",
    ]
};
