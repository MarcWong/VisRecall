#!/usr/bin/env bash

echo -e "\033[32m"
echo "##############################################"
echo "#        VisRecall Auto-Launch-Script        #"
echo "##############################################"
echo "#dist: build locally, upload dist to server  #"
echo "##############################################"
echo -e "\033[0m"

if [ $# = 1 ];then
    if [ $1 = "lab" ];then
        echo "server: 129.69.167.58"
        addr="wangyao@129.69.167.58"
        path="/var/www"
        tar -cf c_dist.tar Front-end
        read -s -n1 -p "please enter the passwd to upload dist, press anykey to continue..."
        echo ""
        scp -r c_dist.tar $addr:$path
        read -s -n1 -p "please enter the passwd again to overwrite dist, press anykey to continue..."
        echo ""
        ssh -tt "$addr" "cd $path && sudo rm -rf G10G1 && sudo tar -xvf c_dist.tar && sudo mv Front-end G10G1 && sudo rm c_dist.tar"
    else
        echo "Usage: $0 [lab]"
        echo "You provided $1 as parameter 1."
        exit
    fi
else
    echo "Usage: $0 [lab]"
    echo "You provided $# parameters,but 1 is required."
    exit
fi