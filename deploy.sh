composer archive create --sourceType dir --sourceName . -a energy@0.0.1.bna

composer network update -a energy@0.0.1.bna -c admin@energy

composer network ping -c admin@energy

composer-rest-server -c admin@energy -n "never" -w true -t false