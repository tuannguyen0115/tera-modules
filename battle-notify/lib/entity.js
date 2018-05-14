const jobs = [
    'warrior',
    'lancer',
    'slayer',
    'berserker',
    'sorcerer',
    'archer',
    'priest',
    'mystic',
    'reaper',
    'gunner',
    'brawler',
    'ninja',
    'valkyrie'
]
const self = {
    cid: {},
    class: 'warrior',
    name: 'Default.Name'
}
const entities = new Map()

function lngcmp(id1, id2){
    return (id1.toString() === id2.toString())
}
module.exports = function EntityManager(dispatch, debug){
    dispatch.hook('S_BOSS_GAGE_INFO', 3, (event) => {
        const entity = getEntity(event.id)
        entity.boss = true
        if(!entity.name) entity.name = `{@Creature:${event.type}#${event.npc}}`
        const player = getEntity(self.cid)
        if(!player.target) player.target = event.id
    })
    dispatch.hook('S_EACH_SKILL_RESULT', 5, (event) => {
        const entity = getEntity(event.target)
        if(!entity.boss) return
        const player = getEntity(event.source)
        player.target = event.target
    })
    dispatch.hook('S_CREATURE_CHANGE_HP', 6, (event) => {
        const entity = getEntity(event.target)
        entity.hp = event.curHp.mul(100).div(event.maxHp)
    })
    dispatch.hook('S_CREATURE_LIFE', 2, (event) => {
        const entity = getEntity(event.gameId)
        entity.dead = !event.alive
    })
    dispatch.hook('S_NPC_STATUS', 1, (event) => {
        const entity = getEntity(event.creature)
        if(event.enraged === 1)
            entity.enraged = true
        if(event.enraged === 0) {
            if(entity.enraged && entity.hp) {
                entity.nextEnrage = entity.hp - 10
                if(entity.nextEnrage < 0) entity.nextEnrage = 0
            }
            entity.enraged = false
        }
    })
    dispatch.hook('S_DESPAWN_NPC', 3, (event) => {
        const entity = getEntity(event.gameId)
        if(event.type === 5 || event.type === 3) entity.dead = true
    })
    dispatch.hook('S_SPAWN_ME', 2, (event) => {
        const entity = getEntity(event.gameId)
        entity.dead = (event.alive === 0)
        entity.name = self.name
        entity.class = self.class
    })
    dispatch.hook('S_SPAWN_USER', 13, (event) => {
        const entity = getEntity(event.gameId)
        const job = (event.templateId - 10101) % 100
        entity.name = event.name
        entity.class = jobs[job]
        entity.dead = !event.alive
    })
    dispatch.hook('S_USER_STATUS', 1, (event) => {
        const entity = getEntity(event.target)
        entity.combat = (event.status === 1)
    })
    dispatch.hook('S_PARTY_MEMBER_LIST', 6, processPartyList)
    //dispatch.hook('S_PARTY_MEMBER_INFO', 3, processPartyList)

    function processPartyList(event) {
        event.members.forEach(member => {
            const entity = getEntity(member.gameId)
            entity.name = member.name
        })
    }
    function getEntity(id){
        if(!id) return false
        id = id.toString()
        if(!entities.has(id)) entities.set(id, {})
        return entities.get(id)
    }

    dispatch.hook('S_LOGIN', 10, (event) => {
        const entity = getEntity(event.gameId)
        const job = (event.templateId - 10101) % 100
        entity.name = event.name
        entity.class = jobs[job]

        self.cid = event.gameId
        self.name = event.name
        self.class = jobs[job]
    })
    dispatch.hook('S_PRIVATE_CHAT', 1, (event) => {
        if(!debug) return
        self.cid = event.authorID
        self.name = event.authorName
    })
    dispatch.hook('S_LOAD_TOPO', 3, (event) => {
        entities.clear()
    })
    this.get = getEntity
    this.myCid = function(){
        return self.cid
    }
    this.myEntity = function(){
        return getEntity(self.cid)
    }
    this.myBoss = function(){
        return getEntity(this.myBossId())
    }
    this.myBossId = function(){
        const entity = this.myEntity()
        return entity.target
    }
    this.self = function(){
        return self
    }
}
