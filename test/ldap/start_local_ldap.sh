#!/bin/bash

sudo docker rm -f ldap
sudo docker run --name ldap -p 389:389 -p 636:636 -d osixia/openldap

# test search
COUNT=1
until ldapsearch -x -h localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
do
    echo "waiting $COUNT"
    (($COUNT++))
    sleep 1
done

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# install example organization
ldapadd -h localhost -x -D 'cn=admin,dc=example,dc=org' -f $DIR/Example.ldif -w admin
