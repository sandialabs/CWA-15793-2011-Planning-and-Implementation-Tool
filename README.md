# CWA 15793 2011 Planning and Implementation Tool version 1.0.0-alpha

![Tool Preview](media/cwa_tool_preview.JPG)

## Description
This software, built on the open source platform Electron (runs on Chromium and Node.js), is designed to assist organizations in the implementation 
of a biorisk management system consistent with the requirements of the international, publicly available guidance document CEN Workshop Agreement 15793:2011 (CWA 15793). 
The software includes tools for conducting organizational gap analysis against CWA 15793 requirements, planning tools to support the implementation of CWA 15793 requirements, 
and performance monitoring support. The gap analysis questions are based on the text of CWA 15793, and its associated guidance document, CEN Workshop Agreement 16393:2012. 
The authors have secured permission from the publisher of CWA 15793, the European Committee for Standardization (CEN), to use language from the document in the software, 
with the understanding that the software will be made available freely, without charge.

## Future plans and extensions
The eventual goal is to iteratively improve the CWA 15793 2011 Tool to include a simpler surveying process and quantitative reports. Extensions, such as cloud database support, 
are possible and contingent upon user demand. There is also a possibility of using the application framework as the basis for a suite of biorisk management applications. 

## Usage
After downloading a package for your operating system, run `CWA 15793 2011 Tool Setup 1.0.0-alpha` in the root folder to install the program. The license terms must be accepted to proceed. 

## System requirements
Operating system: Windows 7 or later and macOS 10.9 or later.
RAM: Recommended 2GB of DDR2 RAM or higher. 
CPU: Recommended 64-bit dual core processor, such as Intel Core 2 Duo or AMD Athlon 64 X2 or newer.
Storage: Maximum of 300MB HDD or SSD storage required; recommended HDD RPM of 7200 or higher. 
Internet Connection: Recommended at least 10Mbps DSL connection for download and updates. 

## Data stored by the program
Evaluation data is only stored within a JSON database that held locally in the root of the installation directory. You can find where this directory is stored by 
right clicking on the desktop icon and opening the file location. The database is called `evaldb.json.` It is not recommended that you edit the JSON file directly; 
mechanisms to purge data from the database are available from within the application. There is currently no published method to encrypt the data inside the JSON file. 

## Updates
Occasional security and software updates may be automatically offered upon application startup. Note that this is not an indication that the author warranties the software. 

## Support
Please direct questions, suggestions, and concerns directly back to your Sandia National Labs (IBCTR) point of contact and ask that they forward your message to the software 
development team. The development team will then contact you directly. 

CWA 15793 2011 Planning and Implementation Tool end-user license agreement:
CC-BY-NC-SA-4.0

Dependencies are listed in the "Attributions" file in the program's "Legal&Templates" folder. 
