#!/bin/bash
sudo -u postgres psql -d PetWebsiteDb -t -c "SELECT \"ImagePath\" FROM \"PetAdImages\" LIMIT 3;"
