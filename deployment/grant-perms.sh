#!/bin/bash
sudo -u postgres psql -d PetWebsiteDb << 'EOF'
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO petwebsite_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO petwebsite_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO petwebsite_user;
EOF
