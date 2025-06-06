
export const learningMaterials = {
  causes: {
    taxation: {
      title: 'British Taxation Policies',
      content: {
        overview: 'After the French and Indian War (1754-1763), Britain faced massive debt and decided to tax the American colonies to help pay for it. This marked a significant shift in British colonial policy.',
        keyPoints: [
          'The Sugar Act (1764) - First attempt at direct taxation',
          'The Stamp Act (1765) - Tax on printed materials',
          'The Tea Act (1773) - Led to the Boston Tea Party',
          'The Intolerable Acts (1774) - Punishment for Boston Tea Party'
        ],
        deepDive: 'The colonists opposed these taxes not just because of the financial burden, but because they had no representation in Parliament. The phrase "taxation without representation" became a rallying cry for colonial resistance.',
        examples: [
          'Stamp Act required tax stamps on newspapers, legal documents, and playing cards',
          'Tea Act gave British East India Company monopoly on tea sales in colonies',
          'Colonists responded with boycotts, protests, and the formation of groups like Sons of Liberty'
        ]
      }
    },
    colonial_response: {
      title: 'Colonial Resistance and Response',
      content: {
        overview: 'Colonists developed various forms of resistance to British policies, from peaceful protests to organized boycotts and eventually armed resistance.',
        keyPoints: [
          'Non-importation agreements and boycotts',
          'Formation of resistance groups like Sons of Liberty',
          'Committees of Correspondence for communication',
          'Continental Congresses for unified colonial action'
        ],
        deepDive: 'Colonial resistance evolved from individual complaints to organized, coordinated efforts across all thirteen colonies. This unity was crucial for the eventual success of the revolution.',
        examples: [
          'Boston Tea Party (1773) - Direct action against Tea Act',
          'First Continental Congress (1774) - Coordinated colonial response',
          'Boycotts reduced British imports by 40% in some years'
        ]
      }
    },
    enlightenment: {
      title: 'Enlightenment Ideas and Natural Rights',
      content: {
        overview: 'Enlightenment philosophers provided the intellectual foundation for American revolutionary thought, particularly concepts of natural rights and government by consent.',
        keyPoints: [
          'John Locke\'s theory of natural rights (life, liberty, property)',
          'Social contract theory - government derives power from consent',
          'Separation of powers (Montesquieu)',
          'Popular sovereignty - power belongs to the people'
        ],
        deepDive: 'These ideas fundamentally challenged the divine right of kings and absolute monarchy, providing colonists with philosophical justification for resistance and eventually independence.',
        examples: [
          'Declaration of Independence echoes Locke\'s natural rights theory',
          'Colonial assemblies practiced self-governance based on consent',
          'Pamphlets like "Common Sense" spread Enlightenment ideas to common people'
        ]
      }
    }
  }
};

export const getContentText = (material: any, tabValue: string) => {
  switch (tabValue) {
    case 'overview':
      return material.content.overview;
    case 'keypoints':
      return `Key Points: ${material.content.keyPoints.join('. ')}.`;
    case 'deepdive':
      return material.content.deepDive;
    case 'examples':
      return `Examples: ${material.content.examples.join('. ')}.`;
    default:
      return material.content.overview;
  }
};
