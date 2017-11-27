# Detect ICMP attacks. In our case we tracked if there were more than 5 pings in 10 seconds
# We would alert for this activity to report it as suspicious
alert icmp any any -> $HOME_NET any (msg: "ICMP packet attack"; detection_filter: track by_dst, count 5, seconds 10; sid:1;)

# Alert when an invalid SNMP packet is sent, this could be an indication of someone trying to 
# attack the system by sending massive amounts of invalid traffic
alert udp any any -> $HOME_NET any (msg:"SNMP missing community string attempt"; content:"|04 00|"; depth:15; offset:5; sid:2;)